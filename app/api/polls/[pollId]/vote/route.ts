import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ pollId: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient()
    const { pollId } = await params

    // Parse request body
    const body = await request.json()

    // Check if poll exists
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, share_without_image, share_without_options, is_closed')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      return Response.json({ error: 'Poll not found' }, { status: 404 })
    }

    if (poll.is_closed) {
      return Response.json({ error: 'Poll is closed' }, { status: 400 })
    }

    // 1. Handle feedback mode (share_without_options = true)
    if (poll.share_without_options) {
      const { voterName, voterEmail, feedbackMessage } = body

      if (!voterName || !voterEmail) {
        return Response.json(
          { error: 'Name and email are required' },
          { status: 400 }
        )
      }

      const { data: responseData, error: insertError } = await supabase
        .from('poll_responses')
        .insert({
          poll_id: pollId,
          voter_name: voterName.trim(),
          voter_email: voterEmail.trim(),
          feedback_message: feedbackMessage?.trim() || null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        return Response.json(
          { error: 'Failed to submit feedback', details: insertError.message },
          { status: 500 }
        )
      }

      return Response.json(
        {
          success: true,
          message: 'Feedback submitted successfully',
          responseId: responseData.id,
        },
        { status: 201 }
      )
    }

    // 2. Handle regular voting mode (share_without_options = false)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Allow unauthenticated votes or use session if available
    const userId = user?.id || null
    const { selectedOptionIds } = body

    if (!selectedOptionIds || !Array.isArray(selectedOptionIds) || selectedOptionIds.length === 0) {
      return Response.json(
        { error: 'Must select at least one option' },
        { status: 400 }
      )
    }

    // Validate that all selected options belong to this poll
    const { data: pollOptions, error: optionsError } = await supabase
      .from('poll_options')
      .select('id')
      .eq('poll_id', pollId)

    if (optionsError || !pollOptions) {
      return Response.json(
        { error: 'Failed to validate options' },
        { status: 500 }
      )
    }

    const validOptionIds = pollOptions.map((opt) => opt.id)
    const isValidSelection = selectedOptionIds.every((optId) =>
      validOptionIds.includes(optId)
    )

    if (!isValidSelection) {
      return Response.json(
        { error: 'Invalid option selection' },
        { status: 400 }
      )
    }

    // Check if user already voted (if authenticated)
    if (userId) {
      const { data: existingVote } = await supabase
        .from('poll_responses')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .single()

      if (existingVote) {
        return Response.json(
          { error: 'You have already voted on this poll' },
          { status: 409 }
        )
      }
    }

    // Insert vote response
    const { data: responseData, error: insertError } = await supabase
      .from('poll_responses')
      .insert({
        poll_id: pollId,
        user_id: userId,
        selected_option_ids: selectedOptionIds,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      return Response.json(
        { error: 'Failed to submit vote', details: insertError.message },
        { status: 500 }
      )
    }

    // Get updated vote counts
    const { data: allResponses } = await supabase
      .from('poll_responses')
      .select('selected_option_ids')
      .eq('poll_id', pollId)

    const voteCounts: Record<string, number> = {}
    allResponses?.forEach((response) => {
      response.selected_option_ids.forEach((optId: string) => {
        voteCounts[optId] = (voteCounts[optId] || 0) + 1
      })
    })

    return Response.json(
      {
        success: true,
        message: 'Vote submitted successfully',
        responseId: responseData.id,
        voteCounts: voteCounts,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error recording vote:', error)
    return Response.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

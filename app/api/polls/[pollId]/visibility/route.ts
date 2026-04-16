import { createSupabaseServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function PATCH(
  request: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    // 1. Get authenticated user
    const supabase = await createSupabaseServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse request body
    const { is_published, visibility } = await request.json()

    // Validate at least one parameter is provided
    if (is_published === undefined && visibility === undefined) {
      return Response.json(
        { error: 'Either is_published or visibility must be provided' },
        { status: 400 }
      )
    }

    // Validate input types
    if (is_published !== undefined && typeof is_published !== 'boolean') {
      return Response.json(
        { error: 'is_published must be a boolean' },
        { status: 400 }
      )
    }

    if (visibility !== undefined && !['public', 'private'].includes(visibility)) {
      return Response.json(
        { error: 'visibility must be either "public" or "private"' },
        { status: 400 }
      )
    }

    // 3. Verify poll ownership
    const { data: poll, error: fetchError } = await supabase
      .from('polls')
      .select('id, user_id, visibility, is_published')
      .eq('id', params.pollId)
      .eq('user_id', user.id) // Only select if user is the owner
      .single()

    if (fetchError || !poll) {
      console.error('Fetch error:', fetchError)
      return Response.json({ error: 'Poll not found or you do not have permission' }, { status: 404 })
    }

    // 4. Build update object - handle both is_published and visibility
    const updateData: any = {}
    if (is_published !== undefined) {
      updateData.is_published = is_published
    }
    if (visibility !== undefined) {
      updateData.visibility = visibility
    }

    // 5. Update poll - Only update user's own polls
    const { data: updatedPoll, error: updateError } = await supabase
      .from('polls')
      .update(updateData)
      .eq('id', params.pollId)
      .eq('user_id', user.id) // Ensure we only update user's own polls
      .select()
      .single()

    if (updateError) {
      console.error('Error updating poll visibility:', updateError)
      return Response.json(
        { error: 'Failed to update poll visibility' },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      poll: updatedPoll,
    })
  } catch (error) {
    console.error('Error in visibility route:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

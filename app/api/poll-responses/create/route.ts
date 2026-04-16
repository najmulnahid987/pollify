import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Poll response request body:', body)
    const { pollId, userId, selectedOptions, voterName, voterEmail, feedbackMessage, rating } = body

    // Validate required fields
    if (!pollId || !voterEmail) {
      return NextResponse.json(
        { error: 'pollId and voterEmail are required' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      console.error('URL:', supabaseUrl)
      console.error('Key:', supabaseKey)
      return NextResponse.json(
        { error: 'Server configuration error - missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Handle errors
            }
          },
        },
      }
    )

    // Insert poll response
    const { data, error } = await supabase
      .from('poll_responses')
      .insert([
        {
          poll_id: pollId,
          user_id: userId || null,
          selected_option_ids: selectedOptions,
          voter_name: voterName,
          voter_email: voterEmail,
          feedback_message: feedbackMessage,
          rating: rating || null,
        },
      ])
      .select()

    console.log('Insert response - data:', data)
    console.log('Insert response - error:', error)

    if (error) {
      console.error('Error inserting poll response:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to save poll response', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error:', errorMessage)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

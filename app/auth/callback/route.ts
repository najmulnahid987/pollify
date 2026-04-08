import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(new URL('/auth/login?error=' + error, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(new URL('/auth/login?error=exchange_failed', request.url))
    }

    // Redirect to dashboard on successful auth
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=callback_error', request.url))
  }
}

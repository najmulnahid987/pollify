import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow API routes through
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Public routes - allow without auth
    const publicRoutes = ['/auth/login', '/auth/signup', '/auth/callback', '/']
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

    // If user is authenticated
    if (session) {
      // Redirect away from auth pages to dashboard
      if (pathname === '/auth/login' || pathname === '/auth/signup') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      // Allow access to protected routes
      return response
    }

    // If user is NOT authenticated
    if (!session) {
      // Allow access to public routes
      if (isPublicRoute) {
        return response
      }
      // Redirect to login for protected routes
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

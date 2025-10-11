import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-otp',
  '/api/auth/resend-otp',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/settings',
  '/shop',
  '/explore',
  '/pod',
  '/ai',
]

// Define API routes that require authentication
const protectedApiRoutes = [
  '/api/ai',
  '/api/pods',
  '/api/user',
  '/api/workspace',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if it's a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If it's a public route, allow access
  if (isPublicRoute) {
    // If user is already authenticated and tries to access auth pages, redirect to dashboard
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (accessToken && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup'))) {
      // Verify the token is valid
      const payload = verifyToken(accessToken)
      if (payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    
    return NextResponse.next()
  }

  // If it's a protected route or API, check authentication
  if (isProtectedRoute || isProtectedApiRoute) {
    // Get access token from cookie or Authorization header
    const accessToken = request.cookies.get('accessToken')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '')

    // No token provided
    if (!accessToken) {
      if (isProtectedApiRoute) {
        // Return 401 for API routes
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      } else {
        // Redirect to signin for web routes
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(signInUrl)
      }
    }

    // Verify the token
    const payload = verifyToken(accessToken)
    
    // Invalid or expired token
    if (!payload) {
      // Try to refresh using refresh token (optional)
      const refreshToken = request.cookies.get('refreshToken')?.value
      
      if (refreshToken) {
        // For simplicity, redirect to refresh endpoint
        // In production, you might want to handle this more elegantly
        if (isProtectedApiRoute) {
          return NextResponse.json(
            { error: 'Token expired', code: 'TOKEN_EXPIRED' },
            { status: 401 }
          )
        } else {
          const signInUrl = new URL('/auth/signin', request.url)
          signInUrl.searchParams.set('from', pathname)
          signInUrl.searchParams.set('reason', 'session_expired')
          return NextResponse.redirect(signInUrl)
        }
      }

      // No refresh token available
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      } else {
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(signInUrl)
      }
    }

    // Token is valid, add user info to headers for API routes
    if (isProtectedApiRoute) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId)
      requestHeaders.set('x-user-email', payload.email)
      requestHeaders.set('x-user-role', payload.role)
      requestHeaders.set('x-session-id', payload.sessionId)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    // Allow access
    return NextResponse.next()
  }

  // Default: allow access
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - .well-known (for various verifications)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.well-known).*)',
  ],
}
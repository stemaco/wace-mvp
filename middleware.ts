import { NextRequest, NextResponse } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/api/auth/signup',
  '/api/auth/signin',
  '/api/auth/signout',
  '/_next',
  '/favicon.ico',
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  if (isProtectedRoute) {
    // Check session cookie
    const sessionId = request.cookies.get('session')?.value

    if (!sessionId) {
      // Redirect to signin
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // For now, just check if session exists
    // In production, you might want to verify the session with the backend
    return NextResponse.next()
  }

  // Allow access to other routes
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - public folder
     */
    '/((?!_next/static|_next/image|public).*)',
  ],
}
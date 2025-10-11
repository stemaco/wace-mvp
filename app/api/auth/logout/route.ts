import { NextRequest, NextResponse } from 'next/server'
import { authStorage } from '@/lib/auth/storage'
import { verifyToken } from '@/lib/auth/jwt-simple'

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookie or header
    const accessToken = request.cookies.get('accessToken')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '')

    // If token exists, try to delete the session
    if (accessToken) {
      const payload = verifyToken(accessToken)
      if (payload?.sessionId) {
        // Delete session from storage
        await authStorage.deleteSession(payload.sessionId)
      }
    }

    // Clear cookies
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

    // Remove all auth cookies
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    response.cookies.set('sessionId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    // Even if there's an error, clear the cookies
    const response = NextResponse.json(
      { message: 'Logged out' },
      { status: 200 }
    )

    response.cookies.set('accessToken', '', { maxAge: 0, path: '/' })
    response.cookies.set('refreshToken', '', { maxAge: 0, path: '/' })
    response.cookies.set('sessionId', '', { maxAge: 0, path: '/' })

    return response
  }
}
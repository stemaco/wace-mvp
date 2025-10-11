import { NextRequest, NextResponse } from 'next/server'
import { authStorage } from '@/lib/auth/storage'
import { verifyToken } from '@/lib/auth/jwt'

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookie or header
    const accessToken = request.cookies.get('accessToken')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(accessToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get session
    const session = await authStorage.getSession(payload.sessionId)
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Get user
    const user = await authStorage.getUserByEmail(payload.email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user data
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          isVerified: user.isVerified,
        },
        session: {
          id: session.id,
          expiresAt: session.expiresAt,
          createdAt: session.createdAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
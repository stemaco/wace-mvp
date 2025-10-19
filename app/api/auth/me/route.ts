import { NextRequest, NextResponse } from 'next/server'
import { authStorage } from '@/lib/auth/storage'

export async function GET(request: NextRequest) {
  try {
    // Get session cookie
    const sessionId = request.cookies.get('session')?.value

    if (!sessionId) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    // Get session from database
    const session = await authStorage.getSession(sessionId)
    if (!session) {
      // Session not found or expired, clear the cookie
      const response = NextResponse.json({ user: null }, { status: 200 })
      response.cookies.delete('session')
      return response
    }

    // Get user data
    const user = await authStorage.getUserById(session.userId)
    if (!user) {
      const response = NextResponse.json({ user: null }, { status: 200 })
      response.cookies.delete('session')
      return response
    }

    // Return user data from session
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

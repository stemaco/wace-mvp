import { NextRequest, NextResponse } from 'next/server'
import { firestoreService } from '@/lib/auth/firestore-service'

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

    // Get session from Firestore
    const sessionResult = await firestoreService.getSession(sessionId)
    if (!sessionResult.success || !sessionResult.data) {
      // Session not found or expired, clear the cookie
      const response = NextResponse.json({ user: null }, { status: 200 })
      response.cookies.delete('session')
      return response
    }

    const session = sessionResult.data

    // Check if session is expired
    const now = new Date()
    const expiresAt = new Date(session.expiresAt)
    if (now > expiresAt) {
      // Session expired, delete it and clear cookie
      await firestoreService.deleteSession(sessionId)
      const response = NextResponse.json({ user: null }, { status: 200 })
      response.cookies.delete('session')
      return response
    }

    // Return user data from session
    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
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

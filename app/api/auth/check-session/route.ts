import { NextRequest, NextResponse } from 'next/server'
import { blobStorage } from '@/lib/auth/blob-storage'

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionId = request.cookies.get('session')?.value

    if (!sessionId) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    // Get session from Blob
    const sessionResult = await blobStorage.get(`sessions/${sessionId}`)
    if (!sessionResult.success || !sessionResult.data) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    const session = sessionResult.data as any

    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
      // Delete expired session
      await blobStorage.del(`sessions/${sessionId}`)
      return NextResponse.json(
        { authenticated: false, reason: 'Session expired' },
        { status: 401 }
      )
    }

    // Return user info (without sensitive data)
    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.email,
        name: session.name,
        role: session.role,
      },
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}
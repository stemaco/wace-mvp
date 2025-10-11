import { NextRequest, NextResponse } from 'next/server'
import { blobStorage } from '@/lib/auth/blob-storage'

export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionId = request.cookies.get('session')?.value

    // Delete session from Blob if exists
    if (sessionId) {
      await blobStorage.del(`sessions/${sessionId}`)
    }

    // Clear session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    // Even if there's an error, clear the cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out',
    })
    response.cookies.set('session', '', { maxAge: 0, path: '/' })
    return response
  }
}
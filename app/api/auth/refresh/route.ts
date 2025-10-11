import { NextRequest, NextResponse } from 'next/server'
import { authStorage } from '@/lib/auth/storage'
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, generateSessionId } from '@/lib/auth/jwt-simple'
import { Session } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie or body
    const refreshTokenFromCookie = request.cookies.get('refreshToken')?.value
    const body = await request.json().catch(() => ({}))
    const refreshToken = refreshTokenFromCookie || body.refreshToken

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Get the old session
    const oldSession = await authStorage.getSession(payload.sessionId)
    if (!oldSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Verify the refresh token matches the session
    if (oldSession.refreshToken !== refreshToken) {
      // Potential token reuse attack - invalidate all sessions for this user
      await authStorage.clearUserSessions(payload.userId)
      
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
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

    // Delete old session
    await authStorage.deleteSession(oldSession.id)

    // Generate new tokens and session (refresh token rotation)
    const newSessionId = generateSessionId()
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: newSessionId,
    })
    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: newSessionId,
    })

    // Create new session
    const newSession: Session = {
      id: newSessionId,
      userId: user.id,
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
    }
    await authStorage.createSession(newSession)

    // Prepare response
    const response = NextResponse.json(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    )

    // Update cookies
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    })

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    response.cookies.set('sessionId', newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
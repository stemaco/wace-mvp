import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateSessionId } from '@/lib/auth/simple-auth'
import { authStorage } from '@/lib/auth/storage'
import { checkLoginLimit } from '@/lib/auth/rate-limiter'

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                request.headers.get('x-real-ip') || 
                'unknown'

    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check rate limit
    const rateLimitResult = await checkLoginLimit(email, ip, false)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Get user data by email
    const user = await authStorage.getUserByEmail(email.toLowerCase())
    if (!user || !user.password) {
      // Don't reveal if user exists, but log for debugging
      console.log('Login attempt for non-existent email or missing password:', email.toLowerCase())
      await checkLoginLimit(email, ip, false) // Mark as failed
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials or sign up for a new account.' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      await checkLoginLimit(email, ip, false) // Mark as failed
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Mark rate limit as successful
    await checkLoginLimit(email, ip, true)

    // Create new session
    const sessionId = generateSessionId()
    const session = {
      id: sessionId,
      userId: user.id,
      token: '', // Will be set by JWT if needed
      refreshToken: '', // Will be set by JWT if needed
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    }

    // Store session in database
    await authStorage.createSession(session)

    // Prepare response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        // Don't expose userId to frontend
      },
    })

    // Set session cookie
    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
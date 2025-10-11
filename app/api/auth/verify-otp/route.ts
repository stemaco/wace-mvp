import { NextRequest, NextResponse } from 'next/server'
import { authStorage } from '@/lib/auth/storage'
import { verifyOTP, cleanOTPInput } from '@/lib/auth/otp'
import { generateSessionId, generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt-simple'
import { checkLoginLimit } from '@/lib/auth/rate-limiter'
import { Session } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                request.headers.get('x-real-ip') || 
                'unknown'

    // Parse request body
    const body = await request.json()
    const { email, code } = body

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    // Clean OTP input (remove spaces and non-digits)
    const cleanCode = cleanOTPInput(code)
    if (cleanCode.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid verification code format' },
        { status: 400 }
      )
    }

    // Check rate limits
    const rateLimitResult = await checkLoginLimit(email, ip, false)
    if (!rateLimitResult.allowed) {
      const retryAfter = rateLimitResult.emailLimit.retryAfter || rateLimitResult.ipLimit.retryAfter
      return NextResponse.json(
        { 
          error: 'Too many verification attempts',
          retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter?.toString() || '900',
          }
        }
      )
    }

    // Verify OTP
    try {
      const isValid = await verifyOTP(email, cleanCode)
      
      if (!isValid) {
        // Mark as failed attempt for rate limiting
        await checkLoginLimit(email, ip, false)
        
        return NextResponse.json(
          { error: 'Invalid or expired verification code' },
          { status: 401 }
        )
      }
    } catch (otpError: any) {
      // Handle specific OTP errors
      if (otpError.message?.includes('expired')) {
        return NextResponse.json(
          { error: 'Verification code has expired' },
          { status: 401 }
        )
      }
      if (otpError.message?.includes('attempts')) {
        return NextResponse.json(
          { error: 'Maximum verification attempts exceeded' },
          { status: 429 }
        )
      }
      
      throw otpError
    }

    // OTP is valid, get user
    const user = await authStorage.getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Mark user as verified if not already
    if (!user.isVerified) {
      await authStorage.updateUser(email, { isVerified: true })
    }

    // Mark rate limit as successful
    await checkLoginLimit(email, ip, true)

    // Generate session
    const sessionId = generateSessionId()
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    })
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    })

    // Create session
    const session: Session = {
      id: sessionId,
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
    }
    await authStorage.createSession(session)

    // Prepare response
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          isVerified: true,
        },
        accessToken,
        refreshToken,
        message: 'Login successful',
      },
      { status: 200 }
    )

    // Set secure cookies
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
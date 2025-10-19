import { NextRequest, NextResponse } from 'next/server'
import { generateUserId, hashPassword, generateOTP, generateSessionId } from '@/lib/auth/simple-auth'
import { authStorage } from '@/lib/auth/storage'
import { emailService } from '@/lib/auth/email'
import { checkRegistrationLimit } from '@/lib/auth/rate-limiter'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt-simple'

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                request.headers.get('x-real-ip') || 
                'unknown'

    // Check rate limit
    const rateLimit = await checkRegistrationLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password, name, step } = body

    // Step 1: Initial signup - store temp data and send OTP
    if (step === 'send-otp') {
      // Validate input
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400 }
        )
      }

      // Check if user exists
      const existingUser = await authStorage.getUserByEmail(email.toLowerCase())
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        )
      }

      // Generate OTP
      const otp = generateOTP()
      
      // Log OTP for debugging/testing
      console.log('=================================')
      console.log('🔐 OTP GENERATED FOR SIGNUP')
      console.log('Email:', email.toLowerCase())
      console.log('OTP Code:', otp)
      console.log('Formatted:', otp.slice(0, 3) + ' ' + otp.slice(3))
      console.log('Expires in: 5 minutes')
      console.log('=================================')
      
      const hashedPassword = await hashPassword(password)

      // Store temp signup data using OTP storage
      // We'll store the hashed password and name in a temporary location
      // In a real app, you might want a separate temp_signups table
      await authStorage.createOTP(email.toLowerCase(), otp)

      // Store additional signup data temporarily (workaround - in production use separate temp_signups table)
      // For now, we'll rely on the OTP and the client to send the data back

      // Send OTP email (will log to console if no API key)
      await emailService.sendOTPEmail(email, otp, { userName: name })

      return NextResponse.json({
        message: 'OTP sent to your email',
        email: email.toLowerCase(),
      })
    }

    // Step 2: Verify OTP and complete signup
    if (step === 'verify-otp') {
      const { email, otp, password, name } = body

      if (!email || !otp || !password || !name) {
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400 }
        )
      }

      // Get OTP from storage
      const storedOtp = await authStorage.getOTP(email.toLowerCase())
      if (!storedOtp) {
        return NextResponse.json(
          { error: 'OTP expired or not found. Please try again.' },
          { status: 400 }
        )
      }

      // Verify OTP
      if (storedOtp.code !== otp) {
        return NextResponse.json(
          { error: 'Invalid OTP' },
          { status: 400 }
        )
      }

      // Create user with unique ID
      const userId = generateUserId()
      const user = {
        id: userId,
        email: email.toLowerCase(),
        name,
        password: await hashPassword(password),
        avatar: null,
        role: 'user' as const,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Store user in database
      await authStorage.createUser(user)

      // Clean up OTP
      await authStorage.deleteOTP(email.toLowerCase())

      // Generate session and tokens
      const sessionId = generateSessionId()
      const accessToken = generateAccessToken({
        userId,
        email: user.email,
        role: user.role,
        sessionId,
      })
      const refreshToken = generateRefreshToken({
        userId,
        email: user.email,
        role: user.role,
        sessionId,
      })

      // Create session
      const session = {
        id: sessionId,
        userId,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        createdAt: new Date(),
      }

      // Store session in database
      await authStorage.createSession(session)

      // Send welcome email
      emailService.sendWelcomeEmail(user.email, user.name).catch(console.error)

      // Prepare response with JWT tokens
      const response = NextResponse.json({
        success: true,
        message: 'Account created successfully',
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
      }, { status: 200 })

      // Set secure cookies (same as verify-otp endpoint)
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
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
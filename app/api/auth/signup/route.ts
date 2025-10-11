import { NextRequest, NextResponse } from 'next/server'
import { generateUserId, hashPassword, generateOTP, generateSessionId } from '@/lib/auth/simple-auth'
import { firestoreService } from '@/lib/auth/firestore-service'
import { emailService } from '@/lib/auth/email'
import { checkRegistrationLimit } from '@/lib/auth/rate-limiter'

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
      const existingUser = await firestoreService.getUserIdByEmail(email.toLowerCase())
      if (existingUser.success && existingUser.data) {
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
      
      const tempData = {
        email: email.toLowerCase(),
        password: await hashPassword(password),
        name,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      }

      // Store temp signup data in Firestore
      await firestoreService.storeTempSignup(email.toLowerCase(), tempData)

      // Send OTP email (will log to console if no API key)
      await emailService.sendOTPEmail(email, otp, { userName: name })

      return NextResponse.json({
        message: 'OTP sent to your email',
        email: email.toLowerCase(),
      })
    }

    // Step 2: Verify OTP and complete signup
    if (step === 'verify-otp') {
      const { email, otp } = body

      if (!email || !otp) {
        return NextResponse.json(
          { error: 'Email and OTP are required' },
          { status: 400 }
        )
      }

      // Get temp signup data from Firestore
      const tempResult = await firestoreService.getTempSignup(email.toLowerCase())
      if (!tempResult.success || !tempResult.data) {
        return NextResponse.json(
          { error: tempResult.error?.message || 'Signup session expired. Please try again.' },
          { status: 400 }
        )
      }

      const tempData = tempResult.data

      // Verify OTP
      if (tempData.otp !== otp) {
        return NextResponse.json(
          { error: 'Invalid OTP' },
          { status: 400 }
        )
      }

      // Create user with unique ID
      const userId = generateUserId()
      const user = {
        id: userId,
        email: tempData.email,
        name: tempData.name,
        password: tempData.password,
        role: 'user',
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Store user in Firestore
      await firestoreService.storeUser(userId, user)

      // Clean up temp data
      await firestoreService.deleteTempSignup(email.toLowerCase())

      // Create session
      const sessionId = generateSessionId()
      const session = {
        id: sessionId,
        userId,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }

      // Store session in Firestore
      await firestoreService.storeSession(sessionId, session)

      // Send welcome email
      emailService.sendWelcomeEmail(user.email, user.name).catch(console.error)

      // Set session cookie
      const response = NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })

      response.cookies.set('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
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
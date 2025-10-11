import { NextRequest, NextResponse } from 'next/server'
import { authStorage } from '@/lib/auth/storage'
import { hashPassword, validatePasswordStrength } from '@/lib/auth/password'
import { generateSessionId, generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt'
import { emailService } from '@/lib/auth/email'
import { checkRegistrationLimit } from '@/lib/auth/rate-limiter'
import { User, Session } from '@/types/auth'

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
        { 
          error: 'Too many registration attempts',
          retryAfter: rateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '3600',
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { email, password, name } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet requirements',
          details: passwordValidation.errors 
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await authStorage.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      email: email.toLowerCase(),
      name: name || email.split('@')[0],
      role: 'user',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Store user with hashed password
    await authStorage.createUser({
      ...user,
      password: hashedPassword,
    } as User & { password: string })

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

    // Send welcome email (async, don't wait)
    emailService.sendWelcomeEmail(user.email, user.name).catch(error => {
      console.error('Failed to send welcome email:', error)
    })

    // Return user data and tokens
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
        },
        accessToken,
        refreshToken,
        message: 'Registration successful',
      },
      { status: 201 }
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

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
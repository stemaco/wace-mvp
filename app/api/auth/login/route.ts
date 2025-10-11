import { NextRequest, NextResponse } from 'next/server'
import { authStorage } from '@/lib/auth/storage'
import { verifyPassword } from '@/lib/auth/password'
import { createOTP } from '@/lib/auth/otp'
import { emailService } from '@/lib/auth/email'
import { checkLoginLimit } from '@/lib/auth/rate-limiter'

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                request.headers.get('x-real-ip') || 
                'unknown'

    // Parse request body
    const body = await request.json()
    const { email, password, useOTP = true } = body

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check rate limits
    const rateLimitResult = await checkLoginLimit(email, ip, false)
    if (!rateLimitResult.allowed) {
      const retryAfter = rateLimitResult.emailLimit.retryAfter || rateLimitResult.ipLimit.retryAfter
      return NextResponse.json(
        { 
          error: 'Too many login attempts',
          retryAfter,
          message: 'Please try again later',
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter?.toString() || '900',
          }
        }
      )
    }

    // Check if user exists
    const user = await authStorage.getUserByEmail(email)
    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // If password is provided and OTP is not requested, verify password
    if (password && !useOTP) {
      // Get user with password from storage
      const userWithPassword = await authStorage.getUserByEmail(email) as any
      if (!userWithPassword?.password) {
        return NextResponse.json(
          { error: 'Password authentication not available' },
          { status: 400 }
        )
      }

      const isValidPassword = await verifyPassword(password, userWithPassword.password)
      if (!isValidPassword) {
        // Mark rate limit as failed attempt
        await checkLoginLimit(email, ip, false)
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Password is valid, but we still recommend OTP for security
      // You can generate session here if you want password-only auth
    }

    // Generate and send OTP
    try {
      const otp = await createOTP(email)
      
      // Get device info from user agent
      const userAgent = request.headers.get('user-agent') || 'Unknown device'
      const deviceInfo = userAgent.split('(')[1]?.split(')')[0] || userAgent
      
      // Send OTP email
      const emailResult = await emailService.sendOTPEmail(email, otp, {
        userName: user.name,
        deviceInfo,
        ipAddress: ip,
      })

      if (!emailResult.success) {
        console.error('Failed to send OTP email:', emailResult.error)
        return NextResponse.json(
          { error: 'Failed to send verification code' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          message: 'Verification code sent to your email',
          email,
          expiresIn: 300, // 5 minutes
        },
        { status: 200 }
      )
    } catch (otpError: any) {
      // Handle OTP generation errors (like rate limiting)
      if (otpError.message?.includes('wait')) {
        return NextResponse.json(
          { error: otpError.message },
          { status: 429 }
        )
      }
      
      throw otpError
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
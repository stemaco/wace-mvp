import { NextRequest, NextResponse } from 'next/server'
import { authStorage } from '@/lib/auth/storage'
import { createOTP, hasPendingOTP, getRemainingTime } from '@/lib/auth/otp'
import { emailService } from '@/lib/auth/email'
import { checkOTPLimit } from '@/lib/auth/rate-limiter'

export async function POST(request: NextRequest) {
  try {
    // Get IP for logging
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                request.headers.get('x-real-ip') || 
                'unknown'

    // Parse request body
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await authStorage.getUserByEmail(email)
    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json(
        { 
          message: 'If an account exists with this email, a new code will be sent',
          expiresIn: 300,
        },
        { status: 200 }
      )
    }

    // Check rate limit for OTP generation
    const rateLimit = await checkOTPLimit(email, false)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many OTP requests',
          retryAfter: rateLimit.retryAfter,
          message: `Please wait ${rateLimit.retryAfter} seconds before requesting a new code`,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '3600',
          }
        }
      )
    }

    // Check if there's an existing OTP that hasn't expired
    const hasExistingOTP = await hasPendingOTP(email)
    if (hasExistingOTP) {
      const remainingTime = await getRemainingTime(email)
      
      // If OTP still has more than 1 minute remaining, don't send new one
      if (remainingTime > 60) {
        return NextResponse.json(
          { 
            error: 'A verification code was recently sent',
            remainingTime,
            message: `Please wait ${Math.ceil(remainingTime / 60)} more minute(s) before requesting a new code`,
          },
          { status: 429 }
        )
      }
    }

    // Generate and send new OTP
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

      // Mark rate limit as successful
      await checkOTPLimit(email, true)

      return NextResponse.json(
        {
          message: 'New verification code sent to your email',
          email,
          expiresIn: 300, // 5 minutes
        },
        { status: 200 }
      )
    } catch (otpError: any) {
      // Handle OTP generation errors
      if (otpError.message?.includes('wait')) {
        return NextResponse.json(
          { 
            error: otpError.message,
            retryAfter: 60,
          },
          { status: 429 }
        )
      }
      
      throw otpError
    }
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
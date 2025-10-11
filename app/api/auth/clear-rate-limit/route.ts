import { NextRequest, NextResponse } from 'next/server'
import { rateLimiter } from '@/lib/auth/rate-limiter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                request.headers.get('x-real-ip') || 
                'unknown'

    // Clear rate limits for this email and IP
    await rateLimiter.reset('registration_ip', ip)
    await rateLimiter.reset('otp_generation', email)
    await rateLimiter.reset('login_email', email)
    await rateLimiter.reset('login_ip', ip)

    return NextResponse.json({
      success: true,
      message: 'Rate limits cleared',
      email,
      ip,
    })
  } catch (error) {
    console.error('Clear rate limit error:', error)
    return NextResponse.json(
      { error: 'Failed to clear rate limits' },
      { status: 500 }
    )
  }
}
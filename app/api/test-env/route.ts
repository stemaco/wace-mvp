import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Check environment variables (safely, without exposing sensitive data)
  const hasResendKey = !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key_here'
  const nodeEnv = process.env.NODE_ENV
  
  return NextResponse.json({
    environment: nodeEnv,
    hasResendKey,
    resendKeyLength: process.env.RESEND_API_KEY?.length || 0,
    // Show first 5 chars of API key for debugging (safe for Resend keys)
    resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5) || 'not set',
  })
}
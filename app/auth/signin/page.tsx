"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OTPInput, OTPTimer } from '@/components/auth/otp-input'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      // Set OTP expiry time
      const expiryTime = new Date(Date.now() + (data.expiresIn || 300) * 1000)
      setOtpExpiry(expiryTime)
      
      // Move to OTP step
      setStep('otp')
      
      // Start resend cooldown
      setResendCooldown(60)
      const cooldownTimer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP
  const handleVerifyOTP = async (code?: string) => {
    const otpCode = code || otp
    if (otpCode.length !== 6) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      // Store tokens in localStorage (optional, cookies are already set)
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken)
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken)
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
      setOtp('') // Clear OTP input on error
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code')
      }

      // Reset expiry time
      const expiryTime = new Date(Date.now() + (data.expiresIn || 300) * 1000)
      setOtpExpiry(expiryTime)
      
      // Reset OTP input
      setOtp('')
      
      // Start resend cooldown
      setResendCooldown(60)
      const cooldownTimer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">
            {step === 'email' 
              ? 'Sign in to your WACE account'
              : 'Enter the verification code sent to your email'
            }
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send verification code
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => setStep('email')}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to email
            </button>

            {/* Email display */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Verification code sent to:
                <br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Enter verification code
              </Label>
              <OTPInput
                value={otp}
                onChange={setOtp}
                onComplete={handleVerifyOTP}
                disabled={loading}
                error={!!error}
                autoFocus
              />
            </div>

            {/* Timer */}
            {otpExpiry && (
              <OTPTimer
                expiresAt={otpExpiry}
                onExpire={() => setError('Verification code has expired')}
                className="text-center"
              />
            )}

            {/* Verify button */}
            <Button
              onClick={() => handleVerifyOTP()}
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify and sign in'
              )}
            </Button>

            {/* Resend button */}
            <div className="text-center">
              {resendCooldown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in {resendCooldown} seconds
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resend verification code
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
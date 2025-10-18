"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { OTPInput } from "@/components/auth/otp-input"

export default function SignUpPage() {
  const router = useRouter()
  const { refreshUser, user } = useAuth()
  const [step, setStep] = useState<'details' | 'verify'>('details')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [otp, setOtp] = useState("")

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          step: 'send-otp',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      setSuccess('Verification code sent! Check your email.')
      setStep('verify')
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp,
          step: 'verify-otp',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      // Success! The API set the session cookie
      // Refresh user state and redirect to dashboard
      setSuccess('Account created successfully!')
      await refreshUser()
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1000)
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.')
      setOtp('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Back to Home Button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" className="rounded-xl text-white hover:bg-white/10 border border-white/10">
          ← Back to Home
        </Button>
      </Link>

      {/* Sign Up Card */}
      <Card className="w-full max-w-md rounded-3xl border-2 border-white/20 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <Image src="/wace.png" alt="WACE" width={48} height={48} className="rounded-xl" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white">
              {step === 'details' ? 'Create Account' : 'Verify Email'}
            </CardTitle>
            <CardDescription className="text-base mt-2 text-gray-300">
              {step === 'details'
                ? 'Start building your dream startup today'
                : `Enter the code sent to ${formData.email}`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-xl">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200 ml-2">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 bg-green-500/10 backdrop-blur-xl">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200 ml-2">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {step === 'details' ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                    className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-primary transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Must be at least 8 characters long
                </p>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 h-12 text-base font-semibold shadow-lg shadow-primary/25 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-400">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="space-y-3">
                <Label className="text-white font-medium text-center block">
                  Verification Code
                </Label>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOTP}
                  disabled={isLoading}
                />
                <p className="text-xs text-center text-gray-400">
                  Check your email for the 6-digit code
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 h-12 text-base font-semibold shadow-lg shadow-primary/25 transition-all"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <button
                onClick={() => {
                  setStep('details')
                  setOtp('')
                  setError('')
                  setSuccess('')
                }}
                className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                ← Back to form
              </button>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-3 text-gray-400 font-medium">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link href="/signin">
              <Button
                variant="outline"
                className="w-full rounded-xl h-12 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all"
              >
                Sign in instead
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

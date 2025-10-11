"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Check, X } from 'lucide-react'

interface PasswordRequirement {
  label: string
  regex: RegExp
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'One uppercase letter', regex: /[A-Z]/ },
  { label: 'One lowercase letter', regex: /[a-z]/ },
  { label: 'One number', regex: /[0-9]/ },
  { label: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
]

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)

  const checkPasswordRequirement = (password: string, regex: RegExp) => {
    return regex.test(password)
  }

  const isPasswordValid = () => {
    return passwordRequirements.every(req => 
      checkPasswordRequirement(formData.password, req.regex)
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Show password requirements when user starts typing password
    if (name === 'password' && value.length > 0) {
      setShowPasswordRequirements(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (!isPasswordValid()) {
      setError('Password does not meet all requirements')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          setError('An account already exists with this email address')
        } else if (data.details) {
          setError(data.details.join(', '))
        } else {
          setError(data.error || 'Registration failed')
        }
        return
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
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-600 mt-2">
            Join WACE and start collaborating
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full"
              autoFocus
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter a strong password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full"
            />
            
            {/* Password Requirements */}
            {showPasswordRequirements && formData.password && (
              <div className="mt-3 space-y-1">
                {passwordRequirements.map((req, index) => {
                  const isMet = checkPasswordRequirement(formData.password, req.regex)
                  return (
                    <div
                      key={index}
                      className={`flex items-center text-xs ${
                        isMet ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {isMet ? (
                        <Check className="mr-1 h-3 w-3" />
                      ) : (
                        <X className="mr-1 h-3 w-3" />
                      )}
                      {req.label}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full"
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !formData.email || !formData.password || 
                     !formData.confirmPassword || !isPasswordValid() ||
                     formData.password !== formData.confirmPassword}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-gray-600">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
          </p>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
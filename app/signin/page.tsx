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
import { ArrowRight, Mail, Lock, Loader2, AlertCircle } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const { refreshUser, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in')
      }

      // Success! The API set the session cookie
      // Refresh user state and redirect to dashboard
      await refreshUser()
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.')
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

      {/* Sign In Card */}
      <Card className="w-full max-w-md rounded-3xl border-2 border-white/20 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <Image src="/wace.png" alt="WACE" width={48} height={48} className="rounded-xl" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-base mt-2 text-gray-300">
              Sign in to continue to your workspace
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

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-primary transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 h-12 text-base font-semibold shadow-lg shadow-primary/25 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-3 text-gray-400 font-medium">New to WACE?</span>
            </div>
          </div>

          <div className="text-center">
            <Link href="/signup">
              <Button
                variant="outline"
                className="w-full rounded-xl h-12 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all"
              >
                Create a free account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

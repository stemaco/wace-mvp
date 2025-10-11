export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: 'user' | 'admin' | 'premium'
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: Date
  createdAt: Date
}

export interface OTP {
  code: string
  email: string
  expiresAt: Date
  attempts: number
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface AuthError {
  code: string
  message: string
  statusCode: number
}

export interface LoginRequest {
  email: string
  password?: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface VerifyOTPRequest {
  email: string
  code: string
}

export interface TokenPayload {
  userId: string
  email: string
  role: string
  sessionId: string
}
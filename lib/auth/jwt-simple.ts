/**
 * Simple JWT implementation that works reliably in all environments
 */

import crypto from 'crypto'
import { TokenPayload } from '@/types/auth'

// Constants
const ACCESS_TOKEN_EXPIRY = 15 * 60 // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 // 7 days
const ISSUER = 'wace-mvp'

interface JWTPayload extends TokenPayload {
  iat: number
  exp: number
  iss: string
  sub: string
}

/**
 * Simple JWT implementation using Node.js built-in crypto
 */
export const JWT = {
  /**
   * Create a simple JWT token
   */
  create(payload: any, expiresIn: number, secret: string): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    }
    
    const now = Math.floor(Date.now() / 1000)
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresIn,
      iss: ISSUER,
    }
    
    // Encode header and payload
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
    const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url')
    
    // Create signature
    const message = `${encodedHeader}.${encodedPayload}`
    const signature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('base64url')
    
    return `${message}.${signature}`
  },

  /**
   * Verify and decode a JWT token
   */
  verify(token: string, secret: string): any | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      const [encodedHeader, encodedPayload, signature] = parts
      
      // Verify signature
      const message = `${encodedHeader}.${encodedPayload}`
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(message)
        .digest('base64url')
      
      if (signature !== expectedSignature) return null
      
      // Decode payload
      const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString())
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) return null
      
      // Check issuer
      if (payload.iss && payload.iss !== ISSUER) return null
      
      return payload
    } catch (error) {
      return null
    }
  },

  /**
   * Decode without verification (for client-side)
   */
  decode(token: string): any | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
      return payload
    } catch (error) {
      return null
    }
  }
}

/**
 * Generate an access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production'
  return JWT.create(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
      sub: payload.userId,
    },
    ACCESS_TOKEN_EXPIRY,
    secret
  )
}

/**
 * Generate a refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production'
  return JWT.create(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
      sub: payload.userId,
    },
    REFRESH_TOKEN_EXPIRY,
    secret
  )
}

/**
 * Verify access token
 */
export function verifyToken(token: string): JWTPayload | null {
  const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production'
  return JWT.verify(token, secret) as JWTPayload | null
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production'
  return JWT.verify(token, secret) as JWTPayload | null
}

/**
 * Decode token without verification
 */
export function decodeToken(token: string): TokenPayload | null {
  const payload = JWT.decode(token)
  if (!payload) return null
  
  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    sessionId: payload.sessionId,
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = JWT.decode(token)
  if (!payload || !payload.exp) return true
  
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

/**
 * Generate session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}
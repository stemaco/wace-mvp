import crypto from 'crypto'
import { TokenPayload } from '@/types/auth'

// Define constants
const ACCESS_TOKEN_EXPIRY = 15 * 60 // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 // 7 days
const ISSUER = 'wace-mvp'

interface JWTHeader {
  alg: string
  typ: string
}

interface JWTPayload extends TokenPayload {
  iat: number
  exp: number
  iss: string
  sub: string
}

/**
 * Base64URL encode
 */
function base64UrlEncode(data: string | Buffer): string {
  return Buffer.from(data)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

/**
 * Base64URL decode
 */
function base64UrlDecode(data: string): string {
  data += '='.repeat((4 - (data.length % 4)) % 4)
  data = data.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(data, 'base64').toString('utf-8')
}

/**
 * Create a JWT signature
 */
function sign(message: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(message)
  return base64UrlEncode(hmac.digest())
}

/**
 * Generate an access token
 */
export function generateAccessToken(
  payload: TokenPayload,
  secret: string = process.env.JWT_SECRET || 'dev-secret'
): string {
  const header: JWTHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const jwtPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + ACCESS_TOKEN_EXPIRY,
    iss: ISSUER,
    sub: payload.userId,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload))
  const message = `${encodedHeader}.${encodedPayload}`
  const signature = sign(message, secret)

  return `${message}.${signature}`
}

/**
 * Generate a refresh token
 */
export function generateRefreshToken(
  payload: TokenPayload,
  secret: string = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'
): string {
  const header: JWTHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const jwtPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + REFRESH_TOKEN_EXPIRY,
    iss: ISSUER,
    sub: payload.userId,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload))
  const message = `${encodedHeader}.${encodedPayload}`
  const signature = sign(message, secret)

  return `${message}.${signature}`
}

/**
 * Verify and decode a token
 */
export function verifyToken(
  token: string,
  secret: string = process.env.JWT_SECRET || 'dev-secret'
): JWTPayload | null {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.')
    
    if (!encodedHeader || !encodedPayload || !signature) {
      return null
    }

    // Verify signature
    const message = `${encodedHeader}.${encodedPayload}`
    const expectedSignature = sign(message, secret)
    
    if (signature !== expectedSignature) {
      return null
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null
    }

    // Check issuer
    if (payload.iss !== ISSUER) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(
  token: string,
  secret: string = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'
): JWTPayload | null {
  return verifyToken(token, secret)
}

/**
 * Extract payload without verification (useful for client-side)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const [, encodedPayload] = token.split('.')
    if (!encodedPayload) return null
    
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload
    
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
    }
  } catch (error) {
    return null
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const [, encodedPayload] = token.split('.')
    if (!encodedPayload) return true
    
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload
    const now = Math.floor(Date.now() / 1000)
    
    return payload.exp ? payload.exp < now : false
  } catch (error) {
    return true
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const [, encodedPayload] = token.split('.')
    if (!encodedPayload) return null
    
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload
    
    return payload.exp ? new Date(payload.exp * 1000) : null
  } catch (error) {
    return null
  }
}

/**
 * Generate session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Legacy class export for backwards compatibility (if needed)
export class JWTService {
  static generateAccessToken = generateAccessToken
  static generateRefreshToken = generateRefreshToken
  static verifyToken = verifyToken
  static verifyRefreshToken = verifyRefreshToken
  static decodeToken = decodeToken
  static isTokenExpired = isTokenExpired
  static getTokenExpiration = getTokenExpiration
  static generateSessionId = generateSessionId
}
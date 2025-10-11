import crypto from 'crypto'
import { TokenPayload } from '@/types/auth'

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

export class JWTService {
  private static readonly ACCESS_TOKEN_EXPIRY = 15 * 60 // 15 minutes
  private static readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 // 7 days
  private static readonly ISSUER = 'wace-mvp'

  /**
   * Base64URL encode
   */
  private static base64UrlEncode(data: string | Buffer): string {
    return Buffer.from(data)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  /**
   * Base64URL decode
   */
  private static base64UrlDecode(data: string): string {
    data += '='.repeat((4 - (data.length % 4)) % 4)
    data = data.replace(/-/g, '+').replace(/_/g, '/')
    return Buffer.from(data, 'base64').toString('utf-8')
  }

  /**
   * Create a JWT signature
   */
  private static sign(message: string, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(message)
    return this.base64UrlEncode(hmac.digest())
  }

  /**
   * Generate an access token
   */
  static generateAccessToken(
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
      exp: now + this.ACCESS_TOKEN_EXPIRY,
      iss: this.ISSUER,
      sub: payload.userId,
    }

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header))
    const encodedPayload = this.base64UrlEncode(JSON.stringify(jwtPayload))
    const message = `${encodedHeader}.${encodedPayload}`
    const signature = this.sign(message, secret)

    return `${message}.${signature}`
  }

  /**
   * Generate a refresh token
   */
  static generateRefreshToken(
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
      exp: now + this.REFRESH_TOKEN_EXPIRY,
      iss: this.ISSUER,
      sub: payload.userId,
    }

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header))
    const encodedPayload = this.base64UrlEncode(JSON.stringify(jwtPayload))
    const message = `${encodedHeader}.${encodedPayload}`
    const signature = this.sign(message, secret)

    return `${message}.${signature}`
  }

  /**
   * Verify and decode a token
   */
  static verifyToken(
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
      const expectedSignature = this.sign(message, secret)
      
      if (signature !== expectedSignature) {
        return null
      }

      // Decode payload
      const payload = JSON.parse(this.base64UrlDecode(encodedPayload)) as JWTPayload

      // Check expiration
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) {
        return null
      }

      // Check issuer
      if (payload.iss !== this.ISSUER) {
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
  static verifyRefreshToken(
    token: string,
    secret: string = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'
  ): JWTPayload | null {
    return this.verifyToken(token, secret)
  }

  /**
   * Extract payload without verification (useful for client-side)
   */
  static decodeToken(token: string): TokenPayload | null {
    try {
      const [, encodedPayload] = token.split('.')
      if (!encodedPayload) return null
      
      const payload = JSON.parse(this.base64UrlDecode(encodedPayload)) as JWTPayload
      
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
  static isTokenExpired(token: string): boolean {
    try {
      const [, encodedPayload] = token.split('.')
      if (!encodedPayload) return true
      
      const payload = JSON.parse(this.base64UrlDecode(encodedPayload)) as JWTPayload
      const now = Math.floor(Date.now() / 1000)
      
      return payload.exp ? payload.exp < now : false
    } catch (error) {
      return true
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const [, encodedPayload] = token.split('.')
      if (!encodedPayload) return null
      
      const payload = JSON.parse(this.base64UrlDecode(encodedPayload)) as JWTPayload
      
      return payload.exp ? new Date(payload.exp * 1000) : null
    } catch (error) {
      return null
    }
  }

  /**
   * Generate session ID
   */
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex')
  }
}

// Export convenience functions
export const generateAccessToken = JWTService.generateAccessToken
export const generateRefreshToken = JWTService.generateRefreshToken
export const verifyToken = JWTService.verifyToken
export const verifyRefreshToken = JWTService.verifyRefreshToken
export const decodeToken = JWTService.decodeToken
export const isTokenExpired = JWTService.isTokenExpired
export const generateSessionId = JWTService.generateSessionId
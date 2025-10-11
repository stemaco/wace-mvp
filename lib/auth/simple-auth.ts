/**
 * Simple Authentication System
 * No JWT, no complex encoding - just simple session management
 */

import crypto from 'crypto'

/**
 * Generate a unique user ID
 */
export function generateUserId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = crypto.randomBytes(8).toString('hex')
  return `user_${timestamp}_${randomStr}`
}

/**
 * Generate a simple session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hash password with salt (simple but secure)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [salt, hash] = hashedPassword.split(':')
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hash === verifyHash
  } catch {
    return false
  }
}

/**
 * Generate OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Create session cookie options
 */
export function getSessionCookieOptions(maxAge: number = 7 * 24 * 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge, // in seconds
    path: '/',
  }
}
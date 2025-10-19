/**
 * Postgres Storage for Authentication
 * Replaces blob storage and Firebase with Vercel Postgres
 */

import { User, Session, OTP as DBUser } from '@/types/auth'
import * as queries from '@/lib/db/queries'
import type { NewUser, NewSession, NewOTP } from '@/lib/db/schema'

class PostgresAuthStorage {
  /**
   * Create a new user
   */
  async createUser(user: User): Promise<void> {
    if (!user.password) {
      throw new Error('Password is required to create a user')
    }

    const userData: NewUser = {
      id: user.id,
      email: user.email.toLowerCase(),
      name: user.name,
      password: user.password,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    await queries.createUser(userData)
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await queries.getUserByEmail(email)

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    const user = await queries.getUserById(id)

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  /**
   * Update user
   */
  async updateUser(email: string, updates: Partial<User>): Promise<void> {
    const user = await this.getUserByEmail(email)
    if (!user) throw new Error('User not found')

    await queries.updateUser(user.id, {
      ...updates,
      updatedAt: new Date(),
    })
  }

  /**
   * Check if user exists
   */
  async userExists(email: string): Promise<boolean> {
    return queries.userExists(email)
  }

  // ==================== SESSION OPERATIONS ====================

  /**
   * Create a new session
   */
  async createSession(session: Session): Promise<void> {
    const sessionData: NewSession = {
      id: session.id,
      userId: session.userId,
      token: session.token,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    }

    await queries.createSession(sessionData)
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    const session = await queries.getSessionById(sessionId)

    if (!session) return null

    return {
      id: session.id,
      userId: session.userId,
      token: session.token,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    }
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<void> {
    await queries.deleteSession(sessionId)
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    const sessions = await queries.getUserSessions(userId)

    return sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      token: session.token,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    }))
  }

  /**
   * Clear all sessions for a user
   */
  async clearUserSessions(userId: string): Promise<void> {
    await queries.deleteUserSessions(userId)
  }

  // ==================== OTP OPERATIONS ====================

  /**
   * Create OTP
   */
  async createOTP(email: string, code: string): Promise<void> {
    const otpData: NewOTP = {
      id: `otp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      email: email.toLowerCase(),
      code,
      attempts: 0,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      createdAt: new Date(),
    }

    await queries.createOTP(otpData)
  }

  /**
   * Get OTP by email
   */
  async getOTP(email: string): Promise<DBUser | null> {
    const otp = await queries.getOTPByEmail(email)

    if (!otp) return null

    return {
      email: otp.email,
      code: otp.code,
      expiresAt: otp.expiresAt,
      attempts: otp.attempts,
    }
  }

  /**
   * Delete OTP
   */
  async deleteOTP(email: string): Promise<void> {
    await queries.deleteOTP(email)
  }

  /**
   * Increment OTP attempts
   */
  async incrementOTPAttempts(email: string): Promise<number> {
    const updated = await queries.incrementOTPAttempts(email)
    return updated.attempts
  }

  // ==================== CLEANUP ====================

  /**
   * Cleanup expired data
   */
  async cleanupExpiredData(): Promise<void> {
    await queries.cleanupExpiredData()
  }
}

// Export singleton instance
export const postgresAuthStorage = new PostgresAuthStorage()

// Export class for testing
export { PostgresAuthStorage }

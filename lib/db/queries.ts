/**
 * Database Queries
 * Type-safe query functions using Drizzle ORM
 */

import { eq, and, gt, lt, desc } from 'drizzle-orm'
import { db } from './index'
import { users, sessions, otps, rateLimits, NewUser, NewSession, NewOTP, NewRateLimit } from './schema'

// ==================== USER QUERIES ====================

/**
 * Create a new user
 */
export async function createUser(data: NewUser) {
  const [user] = await db.insert(users).values(data).returning()
  return user
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()))
  return user || null
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id))
  return user || null
}

/**
 * Update user
 */
export async function updateUser(id: string, data: Partial<NewUser>) {
  const [updated] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning()
  return updated
}

/**
 * Delete user
 */
export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id))
}

/**
 * Check if user exists by email
 */
export async function userExists(email: string) {
  const user = await getUserByEmail(email)
  return user !== null
}

// ==================== SESSION QUERIES ====================

/**
 * Create a new session
 */
export async function createSession(data: NewSession) {
  const [session] = await db.insert(sessions).values(data).returning()
  return session
}

/**
 * Get session by ID
 */
export async function getSessionById(id: string) {
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())))
  return session || null
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(userId: string) {
  return db
    .select()
    .from(sessions)
    .where(and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date())))
}

/**
 * Delete session by ID
 */
export async function deleteSession(id: string) {
  await db.delete(sessions).where(eq(sessions.id, id))
}

/**
 * Delete all sessions for a user
 */
export async function deleteUserSessions(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId))
}

/**
 * Delete expired sessions
 */
export async function deleteExpiredSessions() {
  const now = new Date()
  const result = await db.delete(sessions).where(lt(sessions.expiresAt, now))
  return result
}

// ==================== OTP QUERIES ====================

/**
 * Create a new OTP
 */
export async function createOTP(data: NewOTP) {
  // Delete existing OTPs for this email first
  await db.delete(otps).where(eq(otps.email, data.email.toLowerCase()))

  // Create new OTP
  const [otp] = await db.insert(otps).values({
    ...data,
    email: data.email.toLowerCase(),
  }).returning()
  return otp
}

/**
 * Get OTP by email
 */
export async function getOTPByEmail(email: string) {
  const [otp] = await db
    .select()
    .from(otps)
    .where(and(eq(otps.email, email.toLowerCase()), gt(otps.expiresAt, new Date())))
    .orderBy(desc(otps.createdAt))
  return otp || null
}

/**
 * Increment OTP attempts
 */
export async function incrementOTPAttempts(email: string) {
  const otp = await getOTPByEmail(email)
  if (!otp) throw new Error('OTP not found')

  const [updated] = await db
    .update(otps)
    .set({ attempts: otp.attempts + 1 })
    .where(eq(otps.id, otp.id))
    .returning()

  return updated
}

/**
 * Delete OTP by email
 */
export async function deleteOTP(email: string) {
  await db.delete(otps).where(eq(otps.email, email.toLowerCase()))
}

/**
 * Delete expired OTPs
 */
export async function deleteExpiredOTPs() {
  const now = new Date()
  const result = await db.delete(otps).where(lt(otps.expiresAt, now))
  return result
}

// ==================== RATE LIMIT QUERIES ====================

/**
 * Get rate limit record
 */
export async function getRateLimit(id: string) {
  const [rateLimit] = await db.select().from(rateLimits).where(eq(rateLimits.id, id))
  return rateLimit || null
}

/**
 * Create or update rate limit
 */
export async function upsertRateLimit(data: NewRateLimit) {
  const existing = await getRateLimit(data.id)

  if (existing) {
    const [updated] = await db
      .update(rateLimits)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(rateLimits.id, data.id))
      .returning()
    return updated
  } else {
    const [created] = await db.insert(rateLimits).values(data).returning()
    return created
  }
}

/**
 * Delete rate limit record
 */
export async function deleteRateLimit(id: string) {
  await db.delete(rateLimits).where(eq(rateLimits.id, id))
}

/**
 * Clean up old rate limit records (older than 24 hours)
 */
export async function cleanupOldRateLimits() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const result = await db.delete(rateLimits).where(lt(rateLimits.lastAttempt, oneDayAgo))
  return result
}

// ==================== CLEANUP QUERIES ====================

/**
 * Run all cleanup tasks
 */
export async function cleanupExpiredData() {
  await Promise.all([
    deleteExpiredSessions(),
    deleteExpiredOTPs(),
    cleanupOldRateLimits(),
  ])
}

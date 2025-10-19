/**
 * Database Schema for Vercel Postgres
 * Using Drizzle ORM for type-safe database operations
 */

import { pgTable, text, timestamp, integer, boolean, index, varchar } from 'drizzle-orm/pg-core'

/**
 * Users Table
 * Stores user account information
 */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(), // Hashed with PBKDF2
  role: text('role', { enum: ['user', 'admin', 'premium'] }).notNull().default('user'),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}))

/**
 * Sessions Table
 * Stores active user sessions with JWT tokens
 */
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('session_user_id_idx').on(table.userId),
  expiresAtIdx: index('session_expires_at_idx').on(table.expiresAt),
}))

/**
 * OTPs Table
 * One-Time Passwords for email verification
 */
export const otps = pgTable('otps', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  attempts: integer('attempts').notNull().default(0),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('otp_email_idx').on(table.email),
  expiresAtIdx: index('otp_expires_at_idx').on(table.expiresAt),
}))

/**
 * Rate Limits Table
 * Track authentication rate limiting
 */
export const rateLimits = pgTable('rate_limits', {
  id: text('id').primaryKey(), // Format: 'login:email' or 'register:ip'
  attempts: text('attempts').notNull().default('[]'), // JSON array of timestamps
  lastAttempt: timestamp('last_attempt').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  lastAttemptIdx: index('rate_limit_last_attempt_idx').on(table.lastAttempt),
}))

// Export types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type OTP = typeof otps.$inferSelect
export type NewOTP = typeof otps.$inferInsert
export type RateLimit = typeof rateLimits.$inferSelect
export type NewRateLimit = typeof rateLimits.$inferInsert

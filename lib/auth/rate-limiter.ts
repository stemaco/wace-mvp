/**
 * Rate Limiting Service
 * Prevents brute force attacks and abuse
 */

interface RateLimitRule {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests allowed in the window
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: Date
  retryAfter?: number // Seconds until next request is allowed
}

interface RateLimitStore {
  attempts: number
  firstAttempt: number
  lastAttempt: number
  blocked: boolean
  blockExpiry?: number
}

class RateLimiterService {
  private store: Map<string, RateLimitStore> = new Map()
  private readonly defaultRules: Record<string, RateLimitRule> = {
    // OTP generation - more lenient for testing
    otp_generation: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 10, // Increased from 3 to 10
    },
    // OTP verification - moderate limit
    otp_verification: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      skipSuccessfulRequests: true,
    },
    // Login attempts - per IP
    login_ip: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10,
      skipSuccessfulRequests: true,
    },
    // Login attempts - per email
    login_email: {
      windowMs: 30 * 60 * 1000, // 30 minutes
      maxRequests: 5,
      skipSuccessfulRequests: true,
    },
    // Registration - per IP - more lenient for testing
    registration_ip: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 20, // Increased from 3 to 20 for testing
    },
    // Password reset - per email
    password_reset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
    },
    // API calls - general
    api_general: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 60,
    },
    // API calls - authenticated
    api_authenticated: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 120,
    },
  }

  constructor() {
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  /**
   * Generate a unique key for rate limiting
   */
  private generateKey(
    type: string,
    identifier: string,
    prefix?: string
  ): string {
    const parts = [type]
    if (prefix) parts.push(prefix)
    parts.push(identifier)
    return parts.join(':')
  }

  /**
   * Check if a request is allowed
   */
  async checkLimit(
    type: keyof typeof RateLimiterService.prototype.defaultRules | string,
    identifier: string,
    options?: {
      prefix?: string
      customRule?: RateLimitRule
      success?: boolean
    }
  ): Promise<RateLimitResult> {
    const rule = options?.customRule || this.defaultRules[type] || this.defaultRules.api_general
    const key = this.generateKey(type, identifier, options?.prefix)
    const now = Date.now()

    // Get or create store entry
    let store = this.store.get(key)
    if (!store) {
      store = {
        attempts: 0,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false,
      }
      this.store.set(key, store)
    }

    // Check if currently blocked
    if (store.blocked && store.blockExpiry && store.blockExpiry > now) {
      const retryAfter = Math.ceil((store.blockExpiry - now) / 1000)
      return {
        allowed: false,
        limit: rule.maxRequests,
        remaining: 0,
        resetAt: new Date(store.blockExpiry),
        retryAfter,
      }
    }

    // Check if window has expired
    if (now - store.firstAttempt > rule.windowMs) {
      // Reset the window
      store.attempts = 0
      store.firstAttempt = now
      store.blocked = false
      store.blockExpiry = undefined
    }

    // Skip counting based on success/failure
    const shouldCount = !(
      (options?.success && rule.skipSuccessfulRequests) ||
      (!options?.success && rule.skipFailedRequests)
    )

    if (shouldCount) {
      store.attempts++
    }
    store.lastAttempt = now

    // Check if limit exceeded
    if (store.attempts > rule.maxRequests) {
      // Calculate block duration (exponential backoff)
      const blockDuration = this.calculateBlockDuration(store.attempts - rule.maxRequests, rule.windowMs)
      store.blocked = true
      store.blockExpiry = now + blockDuration

      return {
        allowed: false,
        limit: rule.maxRequests,
        remaining: 0,
        resetAt: new Date(store.blockExpiry),
        retryAfter: Math.ceil(blockDuration / 1000),
      }
    }

    // Request allowed
    const resetAt = new Date(store.firstAttempt + rule.windowMs)
    return {
      allowed: true,
      limit: rule.maxRequests,
      remaining: Math.max(0, rule.maxRequests - store.attempts),
      resetAt,
    }
  }

  /**
   * Calculate block duration with exponential backoff
   */
  private calculateBlockDuration(
    excessAttempts: number,
    baseWindowMs: number
  ): number {
    // Exponential backoff: 2^n * base window (capped at 24 hours)
    const multiplier = Math.pow(2, Math.min(excessAttempts - 1, 5))
    const duration = multiplier * baseWindowMs
    return Math.min(duration, 24 * 60 * 60 * 1000) // Cap at 24 hours
  }

  /**
   * Reset rate limit for a specific key
   */
  async reset(
    type: string,
    identifier: string,
    prefix?: string
  ): Promise<void> {
    const key = this.generateKey(type, identifier, prefix)
    this.store.delete(key)
  }

  /**
   * Get current status for a key
   */
  async getStatus(
    type: keyof typeof RateLimiterService.prototype.defaultRules | string,
    identifier: string,
    prefix?: string
  ): Promise<RateLimitResult> {
    const rule = this.defaultRules[type] || this.defaultRules.api_general
    const key = this.generateKey(type, identifier, prefix)
    const now = Date.now()
    const store = this.store.get(key)

    if (!store) {
      return {
        allowed: true,
        limit: rule.maxRequests,
        remaining: rule.maxRequests,
        resetAt: new Date(now + rule.windowMs),
      }
    }

    // Check if blocked
    if (store.blocked && store.blockExpiry && store.blockExpiry > now) {
      return {
        allowed: false,
        limit: rule.maxRequests,
        remaining: 0,
        resetAt: new Date(store.blockExpiry),
        retryAfter: Math.ceil((store.blockExpiry - now) / 1000),
      }
    }

    // Check if window expired
    if (now - store.firstAttempt > rule.windowMs) {
      return {
        allowed: true,
        limit: rule.maxRequests,
        remaining: rule.maxRequests,
        resetAt: new Date(now + rule.windowMs),
      }
    }

    const remaining = Math.max(0, rule.maxRequests - store.attempts)
    const resetAt = new Date(store.firstAttempt + rule.windowMs)

    return {
      allowed: remaining > 0,
      limit: rule.maxRequests,
      remaining,
      resetAt,
    }
  }

  /**
   * Block a specific identifier immediately
   */
  async block(
    type: string,
    identifier: string,
    durationMs: number,
    prefix?: string
  ): Promise<void> {
    const key = this.generateKey(type, identifier, prefix)
    const now = Date.now()

    this.store.set(key, {
      attempts: Infinity,
      firstAttempt: now,
      lastAttempt: now,
      blocked: true,
      blockExpiry: now + durationMs,
    })
  }

  /**
   * Check if an identifier is currently blocked
   */
  async isBlocked(
    type: string,
    identifier: string,
    prefix?: string
  ): Promise<boolean> {
    const key = this.generateKey(type, identifier, prefix)
    const store = this.store.get(key)
    const now = Date.now()

    return !!(
      store?.blocked &&
      store.blockExpiry &&
      store.blockExpiry > now
    )
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    for (const [key, store] of this.store.entries()) {
      // Remove if not accessed for max age
      if (now - store.lastAttempt > maxAge) {
        this.store.delete(key)
        continue
      }

      // Remove if block has expired and window has passed
      if (
        store.blocked &&
        store.blockExpiry &&
        store.blockExpiry < now &&
        now - store.firstAttempt > maxAge
      ) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Get statistics for monitoring
   */
  getStats(): {
    totalEntries: number
    blockedEntries: number
    activeWindows: number
  } {
    const now = Date.now()
    let blockedEntries = 0
    let activeWindows = 0

    for (const store of this.store.values()) {
      if (store.blocked && store.blockExpiry && store.blockExpiry > now) {
        blockedEntries++
      }
      if (now - store.lastAttempt < 60 * 60 * 1000) {
        activeWindows++
      }
    }

    return {
      totalEntries: this.store.size,
      blockedEntries,
      activeWindows,
    }
  }

  /**
   * Middleware for Express/Next.js API routes
   */
  middleware(
    type: keyof typeof RateLimiterService.prototype.defaultRules | string,
    options?: {
      keyGenerator?: (req: any) => string
      customRule?: RateLimitRule
      skipSuccessfulRequests?: boolean
      onLimitReached?: (req: any, res: any) => void
    }
  ) {
    return async (req: any, res: any, next?: any) => {
      // Generate key from request
      const identifier = options?.keyGenerator
        ? options.keyGenerator(req)
        : this.getDefaultIdentifier(req)

      // Check rate limit
      const result = await this.checkLimit(type, identifier, {
        customRule: options?.customRule,
      })

      // Add headers
      res.setHeader('X-RateLimit-Limit', result.limit.toString())
      res.setHeader('X-RateLimit-Remaining', result.remaining.toString())
      res.setHeader('X-RateLimit-Reset', result.resetAt.toISOString())

      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfter?.toString() || '60')

        if (options?.onLimitReached) {
          return options.onLimitReached(req, res)
        }

        return res.status(429).json({
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again in ${result.retryAfter} seconds.`,
          retryAfter: result.retryAfter,
        })
      }

      // Continue to next middleware
      if (next) {
        next()
      }
    }
  }

  /**
   * Get default identifier from request
   */
  private getDefaultIdentifier(req: any): string {
    // Try to get IP address
    const ip = 
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'unknown'

    return ip
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiterService()

// Export for testing
export { RateLimiterService }

// Export types
export type { RateLimitRule, RateLimitResult, RateLimitStore }

// Helper functions for common use cases
export const checkOTPLimit = (email: string, success?: boolean) =>
  rateLimiter.checkLimit('otp_generation', email, { success })

export const checkLoginLimit = (email: string, ip: string, success?: boolean) =>
  Promise.all([
    rateLimiter.checkLimit('login_email', email, { success }),
    rateLimiter.checkLimit('login_ip', ip, { success }),
  ]).then(([emailResult, ipResult]) => ({
    allowed: emailResult.allowed && ipResult.allowed,
    emailLimit: emailResult,
    ipLimit: ipResult,
  }))

export const checkRegistrationLimit = (ip: string) =>
  rateLimiter.checkLimit('registration_ip', ip)

export const checkPasswordResetLimit = (email: string) =>
  rateLimiter.checkLimit('password_reset', email)
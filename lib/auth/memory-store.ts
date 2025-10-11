/**
 * In-memory store fallback for development
 * This provides a simple in-memory database when Firebase is not configured
 */

class MemoryStore {
  private users = new Map<string, any>()
  private emailMappings = new Map<string, string>()
  private sessions = new Map<string, any>()
  private tempSignups = new Map<string, any>()
  private rateLimits = new Map<string, any>()

  // User operations
  async storeUser(userId: string, userData: any) {
    this.users.set(userId, {
      ...userData,
      id: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    // Store email mapping
    this.emailMappings.set(userData.email.toLowerCase(), userId)
    console.log(`[MemoryStore] Stored user: ${userId}`)
    return { success: true }
  }

  async getUser(userId: string) {
    const user = this.users.get(userId)
    if (!user) {
      return { success: false, error: new Error('User not found') }
    }
    console.log(`[MemoryStore] Retrieved user: ${userId}`)
    return { success: true, data: user }
  }

  async getUserIdByEmail(email: string) {
    const userId = this.emailMappings.get(email.toLowerCase())
    if (!userId) {
      return { success: false, error: new Error('Email not found') }
    }
    console.log(`[MemoryStore] Found user ID for email: ${email}`)
    return { success: true, data: userId }
  }

  // Temp signup operations
  async storeTempSignup(email: string, data: any) {
    this.tempSignups.set(email.toLowerCase(), {
      ...data,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    })
    console.log(`[MemoryStore] Stored temp signup for: ${email}`)
    console.log('[MemoryStore] Temp data:', data)
    return { success: true }
  }

  async getTempSignup(email: string) {
    const data = this.tempSignups.get(email.toLowerCase())
    if (!data) {
      return { success: false, error: new Error('Temp signup not found') }
    }
    
    // Check if expired
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      this.deleteTempSignup(email)
      return { success: false, error: new Error('OTP expired') }
    }
    
    console.log(`[MemoryStore] Retrieved temp signup for: ${email}`)
    return { success: true, data }
  }

  async deleteTempSignup(email: string) {
    const deleted = this.tempSignups.delete(email.toLowerCase())
    console.log(`[MemoryStore] Deleted temp signup for: ${email} - ${deleted}`)
    return { success: true }
  }

  // Session operations
  async storeSession(sessionId: string, sessionData: any) {
    this.sessions.set(sessionId, {
      ...sessionData,
      createdAt: new Date().toISOString(),
    })
    console.log(`[MemoryStore] Stored session: ${sessionId}`)
    return { success: true }
  }

  async getSession(sessionId: string) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return { success: false, error: new Error('Session not found') }
    }
    
    // Check if expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      this.deleteSession(sessionId)
      return { success: false, error: new Error('Session expired') }
    }
    
    console.log(`[MemoryStore] Retrieved session: ${sessionId}`)
    return { success: true, data: session }
  }

  async deleteSession(sessionId: string) {
    const deleted = this.sessions.delete(sessionId)
    console.log(`[MemoryStore] Deleted session: ${sessionId} - ${deleted}`)
    return { success: true }
  }

  // Rate limiting
  async checkRateLimit(key: string, maxAttempts: number, windowMs: number) {
    const now = Date.now()
    const windowStart = now - windowMs
    
    const data = this.rateLimits.get(key) || { attempts: [] }
    const recentAttempts = data.attempts.filter((time: number) => time > windowStart)
    
    if (recentAttempts.length >= maxAttempts) {
      console.log(`[MemoryStore] Rate limit exceeded for: ${key}`)
      return { success: true, data: false }
    }
    
    recentAttempts.push(now)
    this.rateLimits.set(key, { attempts: recentAttempts, lastAttempt: now })
    return { success: true, data: true }
  }

  async resetRateLimit(key: string) {
    this.rateLimits.delete(key)
    console.log(`[MemoryStore] Reset rate limit for: ${key}`)
    return { success: true }
  }

  // Cleanup
  async cleanupExpiredData() {
    const now = new Date()
    
    // Clean expired temp signups
    let cleanedSignups = 0
    this.tempSignups.forEach((data, key) => {
      if (data.expiresAt && new Date(data.expiresAt) < now) {
        this.tempSignups.delete(key)
        cleanedSignups++
      }
    })
    
    // Clean expired sessions
    let cleanedSessions = 0
    this.sessions.forEach((data, key) => {
      if (data.expiresAt && new Date(data.expiresAt) < now) {
        this.sessions.delete(key)
        cleanedSessions++
      }
    })
    
    console.log(`[MemoryStore] Cleaned ${cleanedSignups} expired signups and ${cleanedSessions} expired sessions`)
  }
}

// Export singleton instance
export const memoryStore = new MemoryStore()

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    memoryStore.cleanupExpiredData()
  }, 5 * 60 * 1000)
}
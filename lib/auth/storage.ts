import { User, Session, OTP } from '@/types/auth'
import { blobStorage } from './blob-storage'

interface StorageCache {
  users: Map<string, { data: User; expires: number }>
  sessions: Map<string, { data: Session; expires: number }>
  otps: Map<string, { data: OTP; expires: number }>
}

class AuthStorage {
  private cache: StorageCache = {
    users: new Map(),
    sessions: new Map(),
    otps: new Map(),
  }

  private readonly CACHE_TTL = {
    user: 3600 * 1000, // 1 hour
    session: 300 * 1000, // 5 minutes
    otp: 300 * 1000, // 5 minutes
  }

  constructor() {
    // Initialize cleanup interval
    setInterval(() => this.cleanupExpiredCache(), 60 * 1000) // Clean every minute
  }

  private cleanupExpiredCache() {
    const now = Date.now()
    
    // Clean expired users
    for (const [key, value] of this.cache.users.entries()) {
      if (value.expires < now) {
        this.cache.users.delete(key)
      }
    }
    
    // Clean expired sessions
    for (const [key, value] of this.cache.sessions.entries()) {
      if (value.expires < now) {
        this.cache.sessions.delete(key)
      }
    }
    
    // Clean expired OTPs
    for (const [key, value] of this.cache.otps.entries()) {
      if (value.expires < now) {
        this.cache.otps.delete(key)
      }
    }
  }

  private hashEmail(email: string): string {
    // Simple hash function for demo - replace with proper crypto hash in production
    return Buffer.from(email.toLowerCase()).toString('base64').replace(/[^a-zA-Z0-9]/g, '')
  }

  // User operations
  async createUser(user: User): Promise<void> {
    const key = this.hashEmail(user.email)
    this.cache.users.set(key, {
      data: user,
      expires: Date.now() + this.CACHE_TTL.user,
    })
    
    // Save to Vercel Blob
    await blobStorage.put(`users/${key}/profile.json`, user, {
      contentType: 'application/json',
    })
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const key = this.hashEmail(email)
    
    // Check cache first
    const cached = this.cache.users.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    
    // Fetch from Vercel Blob if not in cache
    const result = await blobStorage.get<User>(`users/${key}/profile.json`)
    if (result.success && result.data) {
      const user = result.data
      this.cache.users.set(key, {
        data: user,
        expires: Date.now() + this.CACHE_TTL.user,
      })
      return user
    }
    
    return null
  }

  async updateUser(email: string, updates: Partial<User>): Promise<void> {
    const user = await this.getUserByEmail(email)
    if (!user) throw new Error('User not found')
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    }
    
    await this.createUser(updatedUser)
  }

  // Session operations
  async createSession(session: Session): Promise<void> {
    this.cache.sessions.set(session.id, {
      data: session,
      expires: Date.now() + this.CACHE_TTL.session,
    })
    
    // Save to Vercel Blob with TTL
    await blobStorage.put(`sessions/${session.id}.json`, session, {
      contentType: 'application/json',
      cacheControlMaxAge: 86400, // 24 hours
    })
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const cached = this.cache.sessions.get(sessionId)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    
    // Fetch from Vercel Blob
    const result = await blobStorage.get<Session>(`sessions/${sessionId}.json`)
    if (result.success && result.data) {
      const session = result.data
      // Check if session has expired
      if (new Date(session.expiresAt) > new Date()) {
        this.cache.sessions.set(sessionId, {
          data: session,
          expires: Date.now() + this.CACHE_TTL.session,
        })
        return session
      } else {
        // Session expired, delete it
        await this.deleteSession(sessionId)
      }
    }
    
    return null
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.cache.sessions.delete(sessionId)
    
    // Delete from Vercel Blob
    await blobStorage.del(`sessions/${sessionId}.json`)
  }

  // OTP operations
  async createOTP(email: string, code: string): Promise<void> {
    const key = this.hashEmail(email)
    const otp: OTP = {
      code,
      email,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0,
    }
    
    this.cache.otps.set(key, {
      data: otp,
      expires: Date.now() + this.CACHE_TTL.otp,
    })
    
    // Save to Vercel Blob with TTL
    await blobStorage.put(`otp/${key}-${Date.now()}.json`, otp, {
      contentType: 'application/json',
      addRandomSuffix: false,
      cacheControlMaxAge: 300, // 5 minutes
    })
  }

  async getOTP(email: string): Promise<OTP | null> {
    const key = this.hashEmail(email)
    const cached = this.cache.otps.get(key)
    
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    
    // Fetch from Vercel Blob
    const listResult = await blobStorage.list({ prefix: `otp/${key}-` })
    if (listResult.success && listResult.data && listResult.data.blobs.length > 0) {
      // Get the most recent OTP (sorted by pathname which includes timestamp)
      const sortedBlobs = listResult.data.blobs.sort((a, b) => 
        b.pathname.localeCompare(a.pathname)
      )
      const latestBlob = sortedBlobs[0]
      
      const result = await blobStorage.get<OTP>(latestBlob.pathname)
      if (result.success && result.data) {
        const otp = result.data
        if (new Date(otp.expiresAt) > new Date()) {
          // Cache it
          this.cache.otps.set(key, {
            data: otp,
            expires: Date.now() + this.CACHE_TTL.otp,
          })
          return otp
        } else {
          // OTP expired, clean it up
          await blobStorage.del(latestBlob.pathname)
        }
      }
    }
    
    return null
  }

  async deleteOTP(email: string): Promise<void> {
    const key = this.hashEmail(email)
    this.cache.otps.delete(key)
    
    // Delete all OTPs for this email from Vercel Blob
    const listResult = await blobStorage.list({ prefix: `otp/${key}-` })
    if (listResult.success && listResult.data) {
      for (const blob of listResult.data.blobs) {
        await blobStorage.del(blob.pathname)
      }
    }
  }

  async incrementOTPAttempts(email: string): Promise<number> {
    const otp = await this.getOTP(email)
    if (!otp) throw new Error('OTP not found')
    
    otp.attempts += 1
    
    const key = this.hashEmail(email)
    this.cache.otps.set(key, {
      data: otp,
      expires: Date.now() + this.CACHE_TTL.otp,
    })
    
    return otp.attempts
  }

  // Check if user exists
  async userExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email)
    return user !== null
  }

  // Get all active sessions for a user
  async getUserSessions(userId: string): Promise<Session[]> {
    const sessions: Session[] = []
    const sessionIds = new Set<string>()
    
    // Check cache first
    for (const [_, cached] of this.cache.sessions.entries()) {
      if (cached.data.userId === userId && cached.expires > Date.now()) {
        sessions.push(cached.data)
        sessionIds.add(cached.data.id)
      }
    }
    
    // Also check Vercel Blob for sessions not in cache
    const listResult = await blobStorage.list({ prefix: 'sessions/' })
    if (listResult.success && listResult.data) {
      for (const blob of listResult.data.blobs) {
        const result = await blobStorage.get<Session>(blob.pathname)
        if (result.success && result.data) {
          const session = result.data
          if (session.userId === userId && 
              new Date(session.expiresAt) > new Date() &&
              !sessionIds.has(session.id)) {
            sessions.push(session)
          }
        }
      }
    }
    
    return sessions
  }

  // Clear all sessions for a user
  async clearUserSessions(userId: string): Promise<void> {
    const sessions = await this.getUserSessions(userId)
    for (const session of sessions) {
      await this.deleteSession(session.id)
    }
  }
}

// Export singleton instance
export const authStorage = new AuthStorage()

// Export for testing
export { AuthStorage }
/**
 * Firestore Service for Authentication
 * Replaces blob storage with Firebase Firestore for production-ready persistence
 */

import { memoryStore } from './memory-store'

// Try to import Firebase, but fall back to memory store if not available
let db: any = null
let COLLECTIONS: any = null
let serverTimestamp: any = null
let useMemoryStore = true // Default to memory store

try {
  const firebaseConfig = require('./firebase-config')
  db = firebaseConfig.db
  COLLECTIONS = firebaseConfig.COLLECTIONS
  serverTimestamp = firebaseConfig.serverTimestamp
  
  // Test if Firebase is actually working
  if (db && typeof db.collection === 'function') {
    console.log('[FirestoreService] Using Firebase Firestore')
    useMemoryStore = false
  } else {
    console.log('[FirestoreService] Firebase not properly initialized, using memory store')
  }
} catch (error) {
  console.log('[FirestoreService] Firebase not configured, using memory store')
}

interface FirestoreResponse<T> {
  data?: T
  error?: Error
  success: boolean
}

class FirestoreService {
  /**
   * Store user data
   */
  async storeUser(userId: string, userData: any): Promise<FirestoreResponse<void>> {
    if (useMemoryStore) {
      return memoryStore.storeUser(userId, userData)
    }
    
    try {
      await db.collection(COLLECTIONS.users).doc(userId).set({
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      // Also store email-to-userId mapping
      await db.collection('email_mappings').doc(userData.email.toLowerCase()).set({
        userId,
        createdAt: serverTimestamp(),
      })
      
      console.log(`[Firestore] Stored user: ${userId}`)
      return { success: true }
    } catch (error) {
      console.error('[Firestore] Error storing user:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<FirestoreResponse<any>> {
    if (useMemoryStore) {
      return memoryStore.getUser(userId)
    }
    
    try {
      const doc = await db.collection(COLLECTIONS.users).doc(userId).get()
      
      if (!doc.exists) {
        return { success: false, error: new Error('User not found') }
      }
      
      console.log(`[Firestore] Retrieved user: ${userId}`)
      return { success: true, data: { id: doc.id, ...doc.data() } }
    } catch (error) {
      console.error('[Firestore] Error getting user:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Get user ID by email
   */
  async getUserIdByEmail(email: string): Promise<FirestoreResponse<string>> {
    if (useMemoryStore) {
      return memoryStore.getUserIdByEmail(email)
    }
    
    try {
      const doc = await db.collection('email_mappings').doc(email.toLowerCase()).get()
      
      if (!doc.exists) {
        return { success: false, error: new Error('Email not found') }
      }
      
      const data = doc.data()
      console.log(`[Firestore] Found user ID for email: ${email}`)
      return { success: true, data: data?.userId }
    } catch (error) {
      console.error('[Firestore] Error getting user by email:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Store temporary signup data
   */
  async storeTempSignup(email: string, data: any): Promise<FirestoreResponse<void>> {
    if (useMemoryStore) {
      return memoryStore.storeTempSignup(email, data)
    }
    
    try {
      await db.collection(COLLECTIONS.tempSignups).doc(email.toLowerCase()).set({
        ...data,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      })
      
      console.log(`[Firestore] Stored temp signup for: ${email}`)
      console.log('[Firestore] Temp data:', data)
      return { success: true }
    } catch (error) {
      console.error('[Firestore] Error storing temp signup:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Get temporary signup data
   */
  async getTempSignup(email: string): Promise<FirestoreResponse<any>> {
    if (useMemoryStore) {
      return memoryStore.getTempSignup(email)
    }
    
    try {
      const doc = await db.collection(COLLECTIONS.tempSignups).doc(email.toLowerCase()).get()
      
      if (!doc.exists) {
        return { success: false, error: new Error('Temp signup not found') }
      }
      
      const data = doc.data()
      
      // Check if expired
      if (data?.expiresAt && new Date(data.expiresAt) < new Date()) {
        await this.deleteTempSignup(email)
        return { success: false, error: new Error('OTP expired') }
      }
      
      console.log(`[Firestore] Retrieved temp signup for: ${email}`)
      return { success: true, data }
    } catch (error) {
      console.error('[Firestore] Error getting temp signup:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Delete temporary signup data
   */
  async deleteTempSignup(email: string): Promise<FirestoreResponse<void>> {
    if (useMemoryStore) {
      return memoryStore.deleteTempSignup(email)
    }
    
    try {
      await db.collection(COLLECTIONS.tempSignups).doc(email.toLowerCase()).delete()
      console.log(`[Firestore] Deleted temp signup for: ${email}`)
      return { success: true }
    } catch (error) {
      console.error('[Firestore] Error deleting temp signup:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Store session
   */
  async storeSession(sessionId: string, sessionData: any): Promise<FirestoreResponse<void>> {
    if (useMemoryStore) {
      return memoryStore.storeSession(sessionId, sessionData)
    }
    
    try {
      await db.collection(COLLECTIONS.sessions).doc(sessionId).set({
        ...sessionData,
        createdAt: serverTimestamp(),
      })
      
      console.log(`[Firestore] Stored session: ${sessionId}`)
      return { success: true }
    } catch (error) {
      console.error('[Firestore] Error storing session:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Get session
   */
  async getSession(sessionId: string): Promise<FirestoreResponse<any>> {
    if (useMemoryStore) {
      return memoryStore.getSession(sessionId)
    }
    
    try {
      const doc = await db.collection(COLLECTIONS.sessions).doc(sessionId).get()
      
      if (!doc.exists) {
        return { success: false, error: new Error('Session not found') }
      }
      
      const data = doc.data()
      
      // Check if expired
      if (data?.expiresAt && new Date(data.expiresAt) < new Date()) {
        await this.deleteSession(sessionId)
        return { success: false, error: new Error('Session expired') }
      }
      
      console.log(`[Firestore] Retrieved session: ${sessionId}`)
      return { success: true, data }
    } catch (error) {
      console.error('[Firestore] Error getting session:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<FirestoreResponse<void>> {
    if (useMemoryStore) {
      return memoryStore.deleteSession(sessionId)
    }
    
    try {
      await db.collection(COLLECTIONS.sessions).doc(sessionId).delete()
      console.log(`[Firestore] Deleted session: ${sessionId}`)
      return { success: true }
    } catch (error) {
      console.error('[Firestore] Error deleting session:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Rate limiting check
   */
  async checkRateLimit(key: string, maxAttempts: number, windowMs: number): Promise<FirestoreResponse<boolean>> {
    if (useMemoryStore) {
      return memoryStore.checkRateLimit(key, maxAttempts, windowMs)
    }
    
    try {
      const docRef = db.collection(COLLECTIONS.rateLimits).doc(key)
      const doc = await docRef.get()
      
      const now = Date.now()
      const windowStart = now - windowMs
      
      if (!doc.exists) {
        // First attempt
        await docRef.set({
          attempts: [now],
          lastAttempt: now,
        })
        return { success: true, data: true }
      }
      
      const data = doc.data()
      const recentAttempts = (data?.attempts || []).filter((time: number) => time > windowStart)
      
      if (recentAttempts.length >= maxAttempts) {
        console.log(`[Firestore] Rate limit exceeded for: ${key}`)
        return { success: true, data: false }
      }
      
      // Add new attempt
      recentAttempts.push(now)
      await docRef.update({
        attempts: recentAttempts,
        lastAttempt: now,
      })
      
      return { success: true, data: true }
    } catch (error) {
      console.error('[Firestore] Error checking rate limit:', error)
      // On error, allow the request
      return { success: true, data: true }
    }
  }

  /**
   * Reset rate limit
   */
  async resetRateLimit(key: string): Promise<FirestoreResponse<void>> {
    if (useMemoryStore) {
      return memoryStore.resetRateLimit(key)
    }
    
    try {
      await db.collection(COLLECTIONS.rateLimits).doc(key).delete()
      console.log(`[Firestore] Reset rate limit for: ${key}`)
      return { success: true }
    } catch (error) {
      console.error('[Firestore] Error resetting rate limit:', error)
      return { success: false, error: error as Error }
    }
  }

  /**
   * Clean up expired data (run periodically)
   */
  async cleanupExpiredData(): Promise<void> {
    if (useMemoryStore) {
      return memoryStore.cleanupExpiredData()
    }
    
    try {
      const now = new Date().toISOString()
      
      // Clean expired temp signups
      const expiredSignups = await db.collection(COLLECTIONS.tempSignups)
        .where('expiresAt', '<', now)
        .get()
      
      const batch = db.batch()
      expiredSignups.forEach(doc => {
        batch.delete(doc.ref)
      })
      
      // Clean expired sessions
      const expiredSessions = await db.collection(COLLECTIONS.sessions)
        .where('expiresAt', '<', now)
        .get()
      
      expiredSessions.forEach(doc => {
        batch.delete(doc.ref)
      })
      
      await batch.commit()
      console.log(`[Firestore] Cleaned up ${expiredSignups.size} expired signups and ${expiredSessions.size} expired sessions`)
    } catch (error) {
      console.error('[Firestore] Error cleaning up expired data:', error)
    }
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService()

// Export types
export type { FirestoreResponse }
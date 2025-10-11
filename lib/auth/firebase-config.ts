/**
 * Firebase Configuration and Initialization
 * Server-side Firebase Admin SDK setup for secure database operations
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    try {
      // Use service account credentials from environment variables
      if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
          projectId: process.env.FIREBASE_PROJECT_ID,
        })
        console.log('[Firebase] Initialized with service account credentials')
      } else {
        // Fallback to default credentials or emulator
        initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || 'wace-mvp',
        })
        console.log('[Firebase] Initialized with default configuration')
      }
    } catch (error) {
      console.error('[Firebase] Initialization error:', error)
      // Fallback to basic configuration
      initializeApp({
        projectId: 'wace-mvp',
      })
    }
  }
}

// Initialize on module load
initializeFirebaseAdmin()

// Export Firestore instance
export const db = getFirestore()

// Collection names
export const COLLECTIONS = {
  users: 'users',
  sessions: 'sessions',
  tempSignups: 'temp_signups',
  rateLimits: 'rate_limits',
} as const

// Helper to get server timestamp
export const serverTimestamp = () => new Date().toISOString()
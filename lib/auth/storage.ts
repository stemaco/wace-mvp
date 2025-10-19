/**
 * Authentication Storage
 * Now using Vercel Postgres instead of Blob storage
 */

import { postgresAuthStorage } from './postgres-storage'

// Export the Postgres storage instance as authStorage
// This maintains backward compatibility with existing code
export const authStorage = postgresAuthStorage

// Export for testing
export { PostgresAuthStorage as AuthStorage } from './postgres-storage'
/**
 * Database Connection and Client
 * Postgres with Drizzle ORM
 * Works with any Postgres database (Vercel, Prisma, Neon, etc.)
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Create Postgres client
// This works in both Vercel (serverless) and local environments
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''

const client = postgres(connectionString, {
  max: 1, // Limit connections for serverless
})

// Create Drizzle instance with the client
export const db = drizzle(client, { schema })

// Export client for advanced queries if needed
export { client as sql }

// Export schema
export * from './schema'

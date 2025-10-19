/**
 * Database Connection and Client
 * Vercel Postgres with Drizzle ORM
 */

import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql as vercelSql } from '@vercel/postgres'
import * as schema from './schema'

// Create Drizzle instance with Vercel Postgres
export const db = drizzle(vercelSql, { schema })

// Export raw SQL for advanced queries if needed
export { vercelSql as sql }

// Export schema
export * from './schema'

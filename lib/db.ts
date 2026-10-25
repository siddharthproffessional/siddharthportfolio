import { Pool } from 'pg'

/**
 * Optional Postgres connection for the contact form (server-only).
 * Returns null when DATABASE_URL is not configured so callers can fall back gracefully.
 */
const globalForPg = globalThis as unknown as { pgPool?: Pool }

export function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({ connectionString, max: 3, connectionTimeoutMillis: 5000 })
  }
  return globalForPg.pgPool
}

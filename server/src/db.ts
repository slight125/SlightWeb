import { Pool } from 'pg';

let _pool: Pool | null = null;

export function getPool(): Pool | null {
  if (_pool) return _pool;
  const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_CONNECTION_STRING;
  if (!DATABASE_URL) return null;
  _pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  return _pool;
}

export async function initDb() {
  const pool = getPool();
  if (!pool) {
    console.warn('No DATABASE_URL set; DB features disabled.');
    return;
  }
  // Create quotes table if it does not exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
  CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);
  `);
}

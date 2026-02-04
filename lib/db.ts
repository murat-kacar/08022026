import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/hka';

const pool = new Pool({ connectionString });

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res;
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

export default pool;

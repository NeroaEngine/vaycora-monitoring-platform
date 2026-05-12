import { Pool } from "pg";

let pool: Pool | undefined;

function shouldUseSsl(connectionString: string) {
  return !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1");
}

export function getPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : false,
    });
  }

  return pool;
}

export async function query<T = unknown>(sql: string, params: unknown[] = []) {
  const result = await getPool().query(sql, params);
  return result.rows as T[];
}

export async function queryOne<T = unknown>(sql: string, params: unknown[] = []) {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

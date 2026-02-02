import { Pool } from 'pg';

let pool;

if (!global.pool) {
    global.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 20, // Limit max connections
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
}
pool = global.pool;

export { pool };
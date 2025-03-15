import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    try {
        const result = await pool.query('SELECT NOW()');
        return res.status(200).json({ message: 'Database connected!', time: result.rows[0] });
    } catch (error) {
        console.error("Database Connection Error:", error);
        return res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
}

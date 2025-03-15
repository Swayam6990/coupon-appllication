import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const userIP = req.headers['x-forwarded-for'] || 'UNKNOWN_IP'; // Ensure we get an IP address

        // Check if the user already claimed a coupon
        const existing = await pool.query(
            `SELECT * FROM coupons WHERE claimed_by_ip = $1 AND claimed_at >= NOW() - INTERVAL '1 hour'`,
            [userIP]
        );

        if (existing.rows.length > 0) {
            return res.status(429).json({ message: "Wait before claiming another coupon." });
        }

        // Find an unclaimed coupon
        const coupon = await pool.query(
            `SELECT * FROM coupons WHERE claimed_by_ip IS NULL ORDER BY id LIMIT 1`
        );

        if (coupon.rows.length === 0) {
            return res.status(404).json({ message: "No coupons available." });
        }

        // Assign coupon to user
        await pool.query(
            `UPDATE coupons SET claimed_by_ip = $1, claimed_at = NOW() WHERE id = $2`,
            [userIP, coupon.rows[0].id]
        );

        return res.status(200).json({ message: "Coupon claimed!", coupon: coupon.rows[0].code });

    } catch (error) {
        console.error("Claim API Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

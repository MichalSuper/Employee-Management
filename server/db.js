import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); 

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_PUBLIC_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});


pool.connect()
    .then(() => console.log(' Connected to PostgreSQL'))
    .catch(err => console.error(' Database connection error:', err));

export default pool;

import pool from '../db.js';

export const getAllJobs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

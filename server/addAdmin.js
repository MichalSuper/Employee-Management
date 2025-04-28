import fs from 'fs';
import bcrypt from 'bcryptjs';
import pool from './db.js';

const email = 'mwer22@gmail.com'; 
const plainPassword = 'Admin234'; 
const hashedPassword = await bcrypt.hash(plainPassword, 10); 

const createAdmin = async () => {
  try {
    await pool.query('DELETE FROM users');

    console.log('All users deleted');

    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, 'admin']
    );

    const adminId = result.rows[0].id;
    console.log(`Admin created with id: ${adminId}`);

  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    pool.end();
  }
};

createAdmin();

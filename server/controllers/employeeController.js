import pool from '../db.js';
import bcrypt from 'bcryptjs';

export const getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT employees.*, jobs.title AS job_title, users.email AS user_email 
      FROM employees 
      LEFT JOIN jobs ON employees.job_id = jobs.id
      LEFT JOIN users ON employees.user_id = users.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving employees' });
  }
};

export const getEmployeeById = async (req, res) => {
  const id = parseInt(req.params.id);
  const requester = req.user; 

  try {
    const result = await pool.query(`
      SELECT employees.*, jobs.title AS job_title, users.email AS user_email 
      FROM employees 
      LEFT JOIN jobs ON employees.job_id = jobs.id
      LEFT JOIN users ON employees.user_id = users.id
      WHERE employees.id = $1
    `, [id]);

    const employee = result.rows[0];

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (requester.role !== 'admin' && requester.id !== employee.user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving employee' });
  }
};

export const createEmployee = async (req, res) => {
  const {
    first_name, last_name, email, phone, address,
    birth_date, start_date, job_id
  } = req.body;

  try {
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const userResult = await pool.query(`
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, 'employee')
      RETURNING id
    `, [email, hashedPassword]);

    const user_id = userResult.rows[0].id;

   
    const result = await pool.query(`
      INSERT INTO employees (first_name, last_name, email, phone, address, birth_date, start_date, job_id, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [first_name, last_name, email, phone, address, birth_date, start_date, job_id, user_id]);

    res.status(201).json({
      employee: result.rows[0],
      tempPassword: generatedPassword 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creating employee' });
  }
};

export const updateEmployee = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    first_name, last_name, email, phone, address,
    birth_date, start_date, job_id
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE employees
      SET first_name=$1, last_name=$2, email=$3, phone=$4, address=$5,
          birth_date=$6, start_date=$7, job_id=$8
      WHERE id=$9
      RETURNING *
    `, [first_name, last_name, email, phone, address, birth_date, start_date, job_id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating employee' });
  }
};

export const deleteEmployee = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(`
      DELETE FROM employees
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting employee' });
  }
};

export const completeProfile = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    birth_date,
    start_date,
    job_id
  } = req.body;

  const userId = req.user.id; 

  try {
    const checkEmployee = await pool.query(`
      SELECT * FROM employees WHERE user_id = $1
    `, [userId]);

    if (checkEmployee.rows.length > 0) {
      return res.status(400).json({ error: 'Profile already completed' });
    }

    const result = await pool.query(`
      INSERT INTO employees 
      (first_name, last_name, email, phone, address, birth_date, start_date, job_id, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      first_name, last_name, email, phone, address,
      birth_date, start_date, job_id, userId
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error completing profile:', err);
    res.status(500).json({ error: 'Error completing profile' });
  }
};


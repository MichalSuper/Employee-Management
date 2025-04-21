import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:id', getEmployeeById);

router.get('/', adminMiddleware, getAllEmployees);
router.post('/', adminMiddleware, createEmployee);
router.put('/:id', adminMiddleware, updateEmployee);
router.delete('/:id', adminMiddleware, deleteEmployee);

export default router;

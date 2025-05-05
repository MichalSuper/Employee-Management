import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  completeProfile,
  getEmployeeByUserId
} from '../controllers/employeeController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/by-user', getEmployeeByUserId);
router.get('/:id', getEmployeeById);
router.post('/complete-profile', completeProfile);


router.get('/', adminMiddleware, getAllEmployees);
router.post('/', adminMiddleware, createEmployee);
router.put('/:id', adminMiddleware, updateEmployee);
router.delete('/:id', adminMiddleware, deleteEmployee);

export default router;

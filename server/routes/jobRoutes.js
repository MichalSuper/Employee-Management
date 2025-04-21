import express from 'express';
import { getAllJobs } from '../controllers/jobController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllJobs);

export default router;

import express from 'express';
import { getProcessSteps, createProcessStep, updateProcessStep, deleteProcessStep } from '../controllers/processController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProcessSteps)
  .post(protect, adminAuth, createProcessStep);

router.route('/:id')
  .put(protect, adminAuth, updateProcessStep)
  .delete(protect, adminAuth, deleteProcessStep);

export default router;

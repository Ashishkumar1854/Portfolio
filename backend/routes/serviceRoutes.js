import express from 'express';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, adminAuth, createService);

router.route('/:id')
  .put(protect, adminAuth, updateService)
  .delete(protect, adminAuth, deleteService);

export default router;

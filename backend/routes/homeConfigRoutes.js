import express from 'express';
import { getHomeConfig, updateHomeConfig } from '../controllers/homeConfigController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getHomeConfig)
  .put(protect, adminAuth, updateHomeConfig);

export default router;

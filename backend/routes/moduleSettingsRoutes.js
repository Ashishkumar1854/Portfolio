import express from 'express';
import {
  getModuleSettings,
  updateModuleSettings,
} from '../controllers/moduleSettingsController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getModuleSettings);
router.put('/', protect, adminAuth, updateModuleSettings);

export default router;

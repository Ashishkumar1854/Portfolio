import express from 'express';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../controllers/achievementController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAchievements)
  .post(protect, adminAuth, createAchievement);

router.route('/:id')
  .put(protect, adminAuth, updateAchievement)
  .delete(protect, adminAuth, deleteAchievement);

export default router;

import express from 'express';
import { getTrustBadges, createTrustBadge, updateTrustBadge, deleteTrustBadge } from '../controllers/trustBadgeController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTrustBadges)
  .post(protect, adminAuth, createTrustBadge);

router.route('/:id')
  .put(protect, adminAuth, updateTrustBadge)
  .delete(protect, adminAuth, deleteTrustBadge);

export default router;

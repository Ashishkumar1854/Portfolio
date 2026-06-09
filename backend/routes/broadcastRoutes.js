import express from 'express';
import { 
  createCampaign, 
  getCampaigns, 
  getBroadcastStats, 
  trackOpen, 
  trackClick 
} from '../controllers/broadcastController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public open/click tracking redirects
router.get('/track/open/:logId', trackOpen);
router.get('/track/click/:logId', trackClick);

// Protected Admin Campaign creation & statistics
router.route('/')
  .get(protect, adminAuth, getCampaigns)
  .post(protect, adminAuth, createCampaign);

router.get('/stats', protect, adminAuth, getBroadcastStats);

export default router;

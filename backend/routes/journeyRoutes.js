import express from 'express';
import { getJourneys, createJourney, updateJourney, deleteJourney } from '../controllers/journeyController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getJourneys)
  .post(protect, adminAuth, createJourney);

router.route('/:id')
  .put(protect, adminAuth, updateJourney)
  .delete(protect, adminAuth, deleteJourney);

export default router;

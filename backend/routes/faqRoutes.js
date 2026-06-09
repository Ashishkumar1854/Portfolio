import express from 'express';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getFAQs)
  .post(protect, adminAuth, createFAQ);

router.route('/:id')
  .put(protect, adminAuth, updateFAQ)
  .delete(protect, adminAuth, deleteFAQ);

export default router;

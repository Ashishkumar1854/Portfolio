import express from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, adminAuth, createTestimonial);

router.route('/:id')
  .put(protect, adminAuth, updateTestimonial)
  .delete(protect, adminAuth, deleteTestimonial);

export default router;

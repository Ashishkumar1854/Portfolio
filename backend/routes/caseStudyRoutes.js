import express from 'express';
import {
  getCaseStudies, getCaseStudy, createCaseStudy, updateCaseStudy,
  deleteCaseStudy, removeScreenshot,
} from '../controllers/caseStudyController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';
import multer from 'multer';

// Multiple file fields: one main image + up to 10 screenshots
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 },
]);

const router = express.Router();

router.route('/')
  .get(getCaseStudies)
  .post(protect, adminAuth, uploadFields, createCaseStudy);

router.route('/:id')
  .get(getCaseStudy)
  .put(protect, adminAuth, uploadFields, updateCaseStudy)
  .delete(protect, adminAuth, deleteCaseStudy);

router.route('/:id/screenshot')
  .delete(protect, adminAuth, removeScreenshot);

export default router;

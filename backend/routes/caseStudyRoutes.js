import express from 'express';
import {
  getCaseStudies, getAdminCaseStudies, getCaseStudy, getCaseStudyBySlug, createCaseStudy, updateCaseStudy,
  deleteCaseStudy, removeScreenshot,
} from '../controllers/caseStudyController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

// Backward compatible field names plus production CMS fields.
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'ogImage', maxCount: 1 },
  { name: 'clientImage', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 },
  { name: 'gallery', maxCount: 10 },
]);

const router = express.Router();

router.route('/')
  .get(getCaseStudies)
  .post(protect, adminAuth, uploadFields, createCaseStudy);

router.get('/admin/all', protect, adminAuth, getAdminCaseStudies);
router.get('/slug/:slug', getCaseStudyBySlug);

router.route('/:id')
  .get(getCaseStudy)
  .put(protect, adminAuth, uploadFields, updateCaseStudy)
  .delete(protect, adminAuth, deleteCaseStudy);

router.route('/:id/screenshot')
  .delete(protect, adminAuth, removeScreenshot);

export default router;

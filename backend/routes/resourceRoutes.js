import express from 'express';
import {
  getResources,
  getResourceBySlug,
  trackDownload,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getResources)
  .post(protect, adminAuth, createResource);

router.route('/:id')
  .put(protect, adminAuth, updateResource)
  .delete(protect, adminAuth, deleteResource);

router.get('/slug/:slug', getResourceBySlug);
router.post('/:id/download', trackDownload);

export default router;

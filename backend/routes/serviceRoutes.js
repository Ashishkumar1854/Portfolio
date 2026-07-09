import express from 'express';
import {
  getAdminServices,
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'ogImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

router.route('/')
  .get(getServices)
  .post(protect, adminAuth, uploadFields, createService);

router.get('/admin/all', protect, adminAuth, getAdminServices);
router.get('/slug/:id', getService);

router.route('/:id')
  .get(getService)
  .put(protect, adminAuth, uploadFields, updateService)
  .delete(protect, adminAuth, deleteService);

export default router;

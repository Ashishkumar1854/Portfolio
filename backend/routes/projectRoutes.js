import express from 'express';
import {
  getProjects,
  getAdminProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();
const projectUploads = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'ogImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

router.route('/')
  .get(getProjects)
  .post(protect, adminAuth, projectUploads, createProject);

router.get('/admin/all', protect, adminAuth, getAdminProjects);
router.get('/slug/:slug', getProjectBySlug);

router.route('/:id')
  .put(protect, adminAuth, projectUploads, updateProject)
  .delete(protect, adminAuth, deleteProject);

export default router;

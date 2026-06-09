import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, adminAuth, upload.single('image'), createProject);

router.route('/:id')
  .put(protect, adminAuth, upload.single('image'), updateProject)
  .delete(protect, adminAuth, deleteProject);

export default router;

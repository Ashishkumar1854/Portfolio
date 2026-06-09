import express from 'express';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, likeBlog, rateBlog } from '../controllers/blogController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, adminAuth, upload.single('image'), createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, adminAuth, upload.single('image'), updateBlog)
  .delete(protect, adminAuth, deleteBlog);

router.post('/:id/like', protect, likeBlog);
router.post('/:id/rate', protect, rateBlog);

export default router;

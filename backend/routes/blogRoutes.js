import express from 'express';
import {
  getBlogs,
  getAdminBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  rateBlog,
} from '../controllers/blogController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();
const blogUploads = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'ogImage', maxCount: 1 },
]);

router.route('/')
  .get(getBlogs)
  .post(protect, adminAuth, blogUploads, createBlog);

router.get('/admin/all', protect, adminAuth, getAdminBlogs);
router.get('/slug/:slug', getBlogBySlug);

router.route('/:id')
  .get(getBlog)
  .put(protect, adminAuth, blogUploads, updateBlog)
  .delete(protect, adminAuth, deleteBlog);

router.post('/:id/like', protect, likeBlog);
router.post('/:id/rate', protect, rateBlog);

export default router;

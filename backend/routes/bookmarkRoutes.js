import express from 'express';
import {
  getUserBookmarks,
  toggleBookmark,
  checkBookmarkStatus,
} from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserBookmarks);

router.post('/toggle', protect, toggleBookmark);
router.get('/check', protect, checkBookmarkStatus);

export default router;

import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  createAnnouncement,
} from '../controllers/notificationController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications);

router.put('/read-all', protect, markAllAsRead);
router.post('/announcement', protect, adminAuth, createAnnouncement);

router.route('/:id/read')
  .put(protect, markNotificationAsRead);

router.route('/:id')
  .delete(protect, deleteNotification);

export default router;

import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  getUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/authController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  '/login',
  authLimiter,
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  loginUser
);

router.post('/logout', logoutUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/users', protect, adminAuth, getUsers);
router.put('/users/:id/role', protect, adminAuth, updateUserRole);
router.delete('/users/:id', protect, adminAuth, deleteUser);

router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email', 'Please include a valid email').isEmail(),
  ],
  forgotPassword
);

router.post(
  '/reset-password/:token',
  authLimiter,
  [
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  resetPassword
);

export default router;

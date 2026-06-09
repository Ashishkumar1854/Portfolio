import express from 'express';
import { 
  getHireRequests, 
  submitHireRequest, 
  updateHireRequest, 
  confirmHireRequest,
  deleteHireRequest 
} from '../controllers/hireController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import { uploadDoc } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(protect, adminAuth, getHireRequests)
  .post(uploadDoc.single('attachment'), submitHireRequest); // single optional attachment

router.route('/:id/confirm')
  .post(protect, adminAuth, confirmHireRequest);

router.route('/:id')
  .put(protect, adminAuth, updateHireRequest)
  .delete(protect, adminAuth, deleteHireRequest);

export default router;

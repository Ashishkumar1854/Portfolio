import express from 'express';
import { 
  getBenefits, 
  createBenefit, 
  updateBenefit, 
  deleteBenefit 
} from '../controllers/benefitController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBenefits)
  .post(protect, adminAuth, createBenefit);

router.route('/:id')
  .put(protect, adminAuth, updateBenefit)
  .delete(protect, adminAuth, deleteBenefit);

export default router;

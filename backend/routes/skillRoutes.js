import express from 'express';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSkills)
  .post(protect, adminAuth, createSkill);

router.route('/:id')
  .put(protect, adminAuth, updateSkill)
  .delete(protect, adminAuth, deleteSkill);

export default router;

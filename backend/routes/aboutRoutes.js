import express from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import { protect, adminAuth } from '../middleware/authMiddleware.js';
import { uploadDoc } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getAbout)
  .put(
    protect, 
    adminAuth, 
    uploadDoc.fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'resume', maxCount: 1 }
    ]), 
    updateAbout
  );

export default router;

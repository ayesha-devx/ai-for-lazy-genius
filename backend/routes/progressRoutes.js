import express from 'express';
import { updateReadingProgress, getUserProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/update', protect, updateReadingProgress);
router.get('/me', protect, getUserProgress);

export default router;

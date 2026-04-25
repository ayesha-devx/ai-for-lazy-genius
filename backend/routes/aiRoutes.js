import express from 'express';
import { summarizeBlog, generateBlog, generateDevGuide, generateSmartNotes } from '../controllers/aiController.js';
import { generateCoverImage } from '../controllers/imageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/summarize', summarizeBlog);
router.post('/dev-guide', generateDevGuide);
router.post('/smart-notes', generateSmartNotes);
router.post('/generate', protect, generateBlog);
router.post('/generate-image', protect, generateCoverImage);

export default router;

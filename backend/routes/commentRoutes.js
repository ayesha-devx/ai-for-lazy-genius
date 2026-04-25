import express from 'express';
import { addComment, getCommentsByBlog } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:blogId', protect, addComment);
router.get('/:blogId', getCommentsByBlog);

export default router;

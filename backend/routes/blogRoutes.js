import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  bookmarkBlog,
  getRecommendedBlogs,
  getPersonalizedFeed,
  getMyBlogs,
} from '../controllers/blogController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/feed', protect, getPersonalizedFeed);
router.get('/recommendations', protect, getRecommendedBlogs);
router.get('/my', protect, getMyBlogs);
router.route('/').get(getAllBlogs).post(protect, createBlog);
router.route('/:id/like').put(protect, likeBlog);
router.route('/:id/bookmark').put(protect, bookmarkBlog);
router
  .route('/:id')
  .get(optionalProtect, getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

export default router;

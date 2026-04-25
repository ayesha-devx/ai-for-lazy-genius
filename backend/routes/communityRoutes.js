import express from 'express';
import {
  getAuthorProfile,
  followAuthor,
  unfollowAuthor,
  getTrendingCreators
} from '../controllers/communityController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/trending', optionalProtect, getTrendingCreators);
router.get('/author/:id', optionalProtect, getAuthorProfile);
router.post('/follow/:id', protect, followAuthor);
router.post('/unfollow/:id', protect, unfollowAuthor);

export default router;

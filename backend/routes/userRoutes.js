import express from 'express';
import { getUserProfile, getUserById, followUser, unfollowUser, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/:id', getUserById);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

export default router;

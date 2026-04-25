import User from '../models/User.js';
import Blog from '../models/Blog.js';
import { createNotification } from '../controllers/notificationController.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get blogs created by user
    const myBlogs = await Blog.find({ author: req.user._id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    // Get blogs liked by user
    const likedBlogs = await Blog.find({ likes: req.user._id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    // Get blogs bookmarked by user
    const bookmarkedBlogs = await Blog.find({ _id: { $in: user.bookmarks } })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      user,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      blogs: myBlogs,
      likedBlogs,
      bookmarks: bookmarkedBlogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get any user profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const blogs = await Blog.find({ author: req.params.id }).sort({ createdAt: -1 });

    res.json({
      user,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      blogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Follow a user
 * @route   POST /api/users/:id/follow
 * @access  Private
 */
export const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user._id;

    if (targetId === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Add target to following of current user
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetId }
    });

    // Add current user to followers of target user
    await User.findByIdAndUpdate(targetId, {
      $addToSet: { followers: currentUserId }
    });

    res.json({ success: true, message: "Successfully followed user" });

    // Create notification for target user
    await createNotification({
      user: targetId,
      sender: currentUserId,
      type: 'follow',
      message: `${req.user.name} started following you`,
      link: `/profile/${currentUserId}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Unfollow a user
 * @route   POST /api/users/:id/unfollow
 * @access  Private
 */
export const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user._id;

    // Remove target from following of current user
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetId }
    });

    // Remove current user from followers of target user
    await User.findByIdAndUpdate(targetId, {
      $pull: { followers: currentUserId }
    });

    res.json({ success: true, message: "Successfully unfollowed user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.title = req.body.title !== undefined ? req.body.title : user.title;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      
      if (req.body.interests) {
        user.interests = Array.isArray(req.body.interests) 
          ? req.body.interests 
          : req.body.interests.split(',').map(s => s.trim().replace(/^#/, ''));
      }

      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.socialLinks) {
        user.socialLinks = {
          ...user.socialLinks,
          ...req.body.socialLinks
        };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        title: updatedUser.title,
        location: updatedUser.location,
        interests: updatedUser.interests,
        following: updatedUser.following,
        bookmarks: updatedUser.bookmarks,
        socialLinks: updatedUser.socialLinks
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

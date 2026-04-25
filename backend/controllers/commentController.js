import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import { createNotification } from './notificationController.js';

// @desc    Add a comment
// @route   POST /api/comments/:blogId
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { blogId } = req.params;

    const comment = await Comment.create({
      text,
      user: req.user._id,
      blog: blogId,
    });

    // Populate user info before sending back
    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json(populatedComment);

    // Create notification for blog author
    const blog = await Blog.findById(blogId);
    if (blog) {
      await createNotification({
        user: blog.author,
        sender: req.user._id,
        type: 'comment',
        message: `${req.user.name} commented on your blog: ${blog.title}`,
        link: `/blogs/${blog._id}`
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
// @access  Public
export const getCommentsByBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

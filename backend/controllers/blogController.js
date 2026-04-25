import Blog from '../models/Blog.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, category, status, image } = req.body;

    const blog = await Blog.create({
      title,
      content,
      tags,
      category,
      status: status || 'draft',
      image,
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = async (req, res) => {
  try {
    const { search, tag, category, sort } = req.query;
    let query = { status: { $ne: 'draft' } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (category) {
      query.category = category;
    }

    let blogsQuery = Blog.find(query).populate('author', 'name email avatar');

    if (sort === 'trending') {
      blogsQuery = blogsQuery.sort({ likes: -1, createdAt: -1 });
    } else {
      blogsQuery = blogsQuery.sort({ createdAt: -1 });
    }

    const blogs = await blogsQuery;
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      'author',
      'name email avatar'
    );

    if (blog) {
      // If blog is a draft, only the author can see it
      if (
        blog.status === 'draft' &&
        (!req.user || blog.author._id.toString() !== req.user._id.toString())
      ) {
        return res.status(401).json({ message: 'Not authorized to view this draft' });
      }
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const { title, content, tags, category, status, image } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.category = category || blog.category;
    blog.status = status || blog.status;
    blog.image = image || blog.image;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like / Unlike blog
// @route   PUT /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Ensure likes is an array
    if (!blog.likes || !Array.isArray(blog.likes)) {
      blog.likes = [];
    }

    // Check if user already liked
    const alreadyLiked = blog.likes.find(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      blog.likes.push(req.user._id);

      // Create notification for author
      await createNotification({
        user: blog.author,
        sender: req.user._id,
        type: 'like',
        message: `${req.user.name} liked your blog: ${blog.title}`,
        link: `/blogs/${blog._id}`
      });
    }

    await blog.save();

    // Populate author before returning
    const populatedBlog = await Blog.findById(blog._id).populate(
      'author',
      'name avatar email'
    );

    res.json(populatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bookmark / Unbookmark blog
// @route   PUT /api/blogs/:id/bookmark
// @access  Private
export const bookmarkBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const blogId = req.params.id;

    if (!user.bookmarks || !Array.isArray(user.bookmarks)) {
      user.bookmarks = [];
    }

    const alreadyBookmarked = user.bookmarks.find(
      (id) => id.toString() === blogId.toString()
    );

    if (alreadyBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== blogId.toString()
      );
    } else {
      // Add bookmark
      user.bookmarks.push(blogId);
    }

    await user.save();
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended blogs for user
// @route   GET /api/blogs/feed
// @access  Private
export const getRecommendedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const userInteractedBlogs = await Blog.find({
      $or: [
        { likes: req.user._id },
        { _id: { $in: user.bookmarks } }
      ]
    });

    const interests = [...new Set(userInteractedBlogs.flatMap(blog => blog.tags || []))];
    const preferredCategories = [...new Set(userInteractedBlogs.map(blog => blog.category).filter(Boolean))];

    if (interests.length === 0 && preferredCategories.length === 0) {
      return res.json([]);
    }

    const alreadyInteractedIds = userInteractedBlogs.map(b => b._id);
    
    let recommended = await Blog.find({
      $or: [
        { tags: { $in: interests } },
        { category: { $in: preferredCategories } }
      ],
      author: { $ne: req.user._id },
      _id: { $nin: alreadyInteractedIds },
      status: { $ne: 'draft' }
    })
    .populate('author', 'name email avatar')
    .sort({ createdAt: -1 })
    .limit(10);

    // Fallback: If no blogs from other authors, show matching blogs from self
    if (recommended.length === 0) {
      recommended = await Blog.find({
        $or: [
          { tags: { $in: interests } },
          { category: { $in: preferredCategories } }
        ],
        _id: { $nin: alreadyInteractedIds },
        status: { $ne: 'draft' }
      })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(10);
    }

    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get personalized feed (blogs from users followed)
 * @route   GET /api/blogs/feed/following
 * @access  Private
 */
export const getPersonalizedFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const following = user.following || [];
    let query = { status: { $ne: 'draft' } };

    if (following.length > 0) {
      // Fetch blogs from users followed
      query.author = { $in: following };
    }

    // Fetch blogs based on query
    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    // If we were looking for following but found nothing, fallback to latest
    if (blogs.length === 0 && following.length > 0) {
      const fallbackBlogs = await Blog.find({ status: { $ne: 'draft' } })
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(20);
      return res.json(fallbackBlogs);
    }

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all blogs of logged-in user (drafts + published)
// @route   GET /api/blogs/my
// @access  Private
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();

    const blogsWithComments = await Promise.all(
      blogs.map(async (blog) => {
        const comments = await Comment.find({ blog: blog._id });
        return { ...blog, comments };
      })
    );

    res.json(blogsWithComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

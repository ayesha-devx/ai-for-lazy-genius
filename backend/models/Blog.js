import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    tags: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['AI Basics', 'Tools', 'Projects', 'Tutorials'],
      default: 'AI Basics',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

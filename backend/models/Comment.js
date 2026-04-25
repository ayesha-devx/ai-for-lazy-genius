import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a comment'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;

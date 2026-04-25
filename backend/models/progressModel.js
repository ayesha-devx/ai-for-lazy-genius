import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  streakCount: {
    type: Number,
    default: 0
  },
  lastReadDate: {
    type: Date,
    default: null
  },
  weeklyGoal: {
    type: Number,
    default: 7
  },
  weeklyCompleted: {
    type: Number,
    default: 0
  },
  totalArticlesRead: {
    type: Number,
    default: 0
  },
  totalNotesSaved: {
    type: Number,
    default: 0
  },
  badges: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;

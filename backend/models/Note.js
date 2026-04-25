import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  aiNotes: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Smart Note'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model('Note', noteSchema);
export default Note;

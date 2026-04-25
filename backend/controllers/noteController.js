import Note from '../models/Note.js';

/**
 * @desc    Save a new smart note
 * @route   POST /api/notes
 * @access  Private
 */
export const createNote = async (req, res) => {
  try {
    const { originalText, aiNotes, title } = req.body;

    if (!originalText || !aiNotes) {
      return res.status(400).json({ message: "Original text and AI notes are required." });
    }

    const note = await Note.create({
      user: req.user._id,
      originalText,
      aiNotes,
      title: title || 'Smart Note'
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Save Note Error:", error);
    res.status(500).json({ message: "Failed to save note." });
  }
};

/**
 * @desc    Get all notes for the logged-in user
 * @route   GET /api/notes
 * @access  Private
 */
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Get Notes Error:", error);
    res.status(500).json({ message: "Failed to fetch notes." });
  }
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check ownership
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized to delete this note." });
    }

    await note.deleteOne();
    res.json({ message: "Note removed." });
  } catch (error) {
    console.error("Delete Note Error:", error);
    res.status(500).json({ message: "Failed to delete note." });
  }
};

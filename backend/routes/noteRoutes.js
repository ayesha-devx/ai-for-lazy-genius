import express from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All note routes are protected

router.route('/')
  .post(createNote)
  .get(getNotes);

router.route('/:id')
  .delete(deleteNote);

export default router;

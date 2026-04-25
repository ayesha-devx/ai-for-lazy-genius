import express from "express";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
router.post("/", protect, upload.single("image"), (req, res) => {
  console.log('Upload request received');
  if (!req.file) {
    console.log('No file in request');
    return res.status(400).json({ message: "Please upload an image" });
  }
  
  console.log('File uploaded to Cloudinary:', req.file.path);
  res.json({
    imageUrl: req.file.path,
  });
});

export default router;

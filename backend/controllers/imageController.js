import { generateImage } from "../utils/imageAI.js";

/**
 * @desc    Generate a cover image using AI with Unsplash fallback
 * @route   POST /api/ai/generate-image
 * @access  Private
 */
export const generateCoverImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt required" });
    }

    let imageUrl;

    try {
      imageUrl = await generateImage(prompt);
    } catch (error) {
      console.log("HF failed, using fallback...");

      // ✅ Updated fallback: LoremFlickr is more reliable than the deprecated Unsplash Source
      // It will return a random image based on the keywords and prompt
      const keywords = `ai,tech,${prompt.split(' ').slice(0, 2).join(',')}`;
      imageUrl = `https://loremflickr.com/800/600/${encodeURIComponent(keywords)}`;
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error('Image Controller Error:', error);
    res.status(500).json({ message: "Image generation failed" });
  }
};

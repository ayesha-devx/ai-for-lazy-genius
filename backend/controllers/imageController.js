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

export const proxyPollinations = async (req, res) => {
  try {
    const { prompt, seed } = req.query;
    if (!prompt) return res.status(400).send('Prompt is required');
    
    // Using fetch to get the image buffer from Pollinations
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=400&nologo=true&seed=${seed || 1}`;
    
    const response = await fetch(url);
    if (!response.ok) {
       throw new Error('Pollinations rate limit or server error');
    }
    
    const buffer = await response.arrayBuffer();
    
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Failed to generate image proxy');
  }
};

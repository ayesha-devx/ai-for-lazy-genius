import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates a high-quality cover image using Hugging Face Stable Diffusion XL.
 */
export const generateImage = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        inputs: `Professional blog cover image for: ${prompt}, modern, minimal, futuristic`,
        options: { wait_for_model: true }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: 'arraybuffer'
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");

    return `data:image/png;base64,${base64}`;
  } catch (error) {
    if (error.response) {
        console.error("HF Error Details:", Buffer.from(error.response.data).toString());
    }
    throw error;
  }
};


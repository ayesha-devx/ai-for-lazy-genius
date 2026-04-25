import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a full blog post based on topic, tone, and level.
 */
export const generateBlogContent = async ({ topic, tone, level }) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert technical blog writer known as the "Lazy Genius".
      Your goal is to write a high-quality, publish-ready blog post that is engaging and easy to understand.

      Topic: ${topic}
      Tone: ${tone}
      Level: ${level}

      Requirements:
      * Use Markdown format
      * Add headings (##, ###)
      * Add bullet points where useful
      * Keep it engaging and witty
      * Add real-world examples
      * Keep it clean and readable

      Structure:
      1. Title (H1)
      2. Introduction
      3. Main sections (H2, H3)
      4. Conclusion

      Make it high-quality and structured perfectly in Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error(error.message || "Failed to generate blog content");
  }
};

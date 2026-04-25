import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { generateBlogContent } from "../utils/ai.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @desc    Summarize blog content using Google Gemini AI
 * @route   POST /api/ai/summarize
 * @access  Public (or Private if you want to restrict it)
 */
export const summarizeBlog = async (req, res) => {
  try {
    const { content } = req.body;
    console.log("Checking Gemini Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");

    if (!content) {
      return res.status(400).json({ message: "Content is required for summarization." });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(500).json({ message: "Gemini API key is missing. Please configure it in the .env file." });
    }

    // Initialize the model (Verified working with quota)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are "Lazy Genius AI" — a smart, witty, slightly sarcastic AI that explains complex topics in the simplest, most efficient way possible.

      Your personality:
      * Minimal effort, maximum clarity
      * Slight humor, but not childish
      * Confident and modern tone
      * Feels like a senior dev explaining things casually

      ---

      TASK:
      Explain the following content in a "lazy genius" way.

      CONTENT:
      ${content}

      ---

      OUTPUT RULES:

      1. Structure your answer EXACTLY like this:

      ### 🧠 What is [Subject]?
      Explain the core concept in 2-3 lines max.

      ### 🧩 How It Works (No Brain Pain)
      Break it into simple bullet points:
      * Use short lines
      * No heavy jargon
      * Make it feel effortless

      ### ⚡ Why You Should Care
      Explain real-world importance in 2-3 lines.

      ### 💤 The Lazy Summary
      Give a 1–2 line ultra-short takeaway.

      2. Style Guidelines:
      * Use emojis (🧠 🧩 ⚡ 💤) but DO NOT overuse
      * Keep sentences short
      * Avoid long paragraphs
      * Avoid words like "furthermore", "thus", etc.

      3. Tone:
      * Casual but intelligent
      * Slightly witty
      * No over-explaining

      4. Formatting:
      * Use clean spacing
      * Use headings exactly as given (including the ###)

      5. Length:
      * Keep it concise
      * Max 150–200 words
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ summary: text });
  } catch (error) {
    console.error("AI Summarization Error:", error);
    // Send the actual error message to help debug
    res.status(500).json({ 
      message: error.message || "Failed to generate AI summary. Please check your API key and model availability."
    });
  }
};

/**
 * @desc    Generate a full blog post using Google Gemini AI
 * @route   POST /api/ai/generate
 * @access  Private
 */
export const generateBlog = async (req, res) => {
  try {
    const { topic, tone, level } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const content = await generateBlogContent({ topic, tone, level });

    res.json({ content });
  } catch (error) {
    console.error("Blog Generation Error:", error);
    res.status(500).json({ 
      message: error.message || "AI generation failed. Please check your API key and quota." 
    });
  }
};

/**
 * @desc    Generate a complete "Do It For Me" developer guide
 * @route   POST /api/ai/dev-guide
 * @access  Public
 */
export const generateDevGuide = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key is missing." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are "Lazy Genius AI" — a senior software engineer and mentor.
      Your job is to convert the provided blog content into practical, actionable developer output.

      ---
      CONTENT TO PROCESS:
      ${content}
      ---

      TASK:
      Generate a complete "Do It For Me" response with the following sections. 
      Use the EXACT headings provided below.

      ## 🧠 Concept Breakdown (Very Simple)
      * Explain the core idea in 2–3 lines. Avoid jargon.

      ## ⚡ Step-by-Step Implementation
      * Provide short, actionable bullet points to build the solution.

      ## 📁 Project Structure
      * Provide a realistic MERN/Web folder structure in a code block.

      ## 💻 Starter Code (Important)
      * Provide minimal, clean, working code (React/Express/Node) in a code block.
      * Focus on core logic. Add brief comments.

      ## 🚀 Quick Start Instructions
      * How to run, install, and setup (briefly).

      ## 📝 Smart Notes (Lazy Genius Style)
      * Key takeaways, common mistakes, and pro tips.

      ## 🎯 Mini Practice Task
      * One small task to reinforce learning.

      STYLE RULES:
      * Keep it concise and use clean spacing.
      * Emojis ONLY for section headers.
      * Casual, senior dev vibe.
      * NO long paragraphs.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ guide: text });
  } catch (error) {
    console.error("Dev Guide Generation Error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to generate developer guide."
    });
  }
};

/**
 * @desc    Generate structured notes from highlighted text
 * @route   POST /api/ai/smart-notes
 * @access  Public
 */
export const generateSmartNotes = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "No text provided." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key is missing." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are "Lazy Genius AI" — a smart, efficient note-taking assistant for developers.
      Your job is to convert the following highlighted text into clear, structured notes.

      ---
      TEXT:
      ${text}
      ---

      TASK:
      Transform the text into easy-to-understand notes using the EXACT sections below:

      ## 🧠 Key Idea
      * Summarize the main concept in ONE clear sentence. No jargon.

      ## ⚡ Quick Summary
      * Explain in 2–3 short, conversational lines. Focus on understanding.

      ## 📌 Key Points
      * Short bullet points (1 line each) of the most important info.

      ## 💻 Developer Insight (Important)
      * Practical usage in real projects.

      ## 🧪 Mini Example (if possible)
      * A simple example or use-case.

      STYLE RULES:
      * Concise, clean spacing, simple English.
      * No long paragraphs, no fluff.
      * Casual, senior dev vibe.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const notes = response.text();

    res.json({ notes });
  } catch (error) {
    console.error("Smart Notes Error:", error);
    res.status(500).json({ message: "Failed to generate notes." });
  }
};


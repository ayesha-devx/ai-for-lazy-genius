import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // Note: The Node SDK might not expose listModels directly in the simple way,
    // so we will try to just fetch a response with a generic name
    console.log("Checking API Key validity...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("SUCCESS: gemini-1.5-flash is working!");
  } catch (error) {
    console.log("FAILURE on gemini-1.5-flash:", error.message);
    try {
        console.log("Trying gemini-1.5-flash-latest...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("test");
        console.log("SUCCESS: gemini-1.5-flash-latest is working!");
    } catch (err2) {
        console.log("FAILURE on gemini-1.5-flash-latest:", err2.message);
    }
  }
}

listModels();

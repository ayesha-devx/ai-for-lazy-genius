import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const listModels = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels on genAI in the simple SDK, 
    // but we can try to hit an endpoint or just guess.
    // Actually, I'll try 'gemini-1.5-flash-latest'
    console.log("Testing with gemini-1.5-flash-latest");
  } catch (e) {
    console.error(e);
  }
};
listModels();

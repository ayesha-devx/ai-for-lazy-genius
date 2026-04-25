import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // The standard SDK doesn't have a direct listModels, 
    // but we can try to fetch them via the REST API if needed.
    // However, let's try a few common ones and see which ones throw 404 vs other errors.
    
    const testModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-pro-latest"
    ];

    for (const m of testModels) {
      try {
        console.log(`Testing ${m} (v1)...`);
        const model = genAI.getGenerativeModel({ model: m }, { apiVersion: 'v1' });
        const result = await model.generateContent("test");
        console.log(`✅ ${m} (v1) is WORKING!`);
        return; 
      } catch (e) {
        console.log(`❌ ${m} (v1) FAILED: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("Fatal Error:", error);
  }
}

listModels();

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelsToTest = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-1.0-pro",
  "gemini-flash-latest",
  "gemini-pro-latest"
];

async function findWorkingModel() {
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hi");
      console.log(`✅ SUCCESS: ${modelName} is working and has quota!`);
      return;
    } catch (error) {
      console.log(`❌ FAILED ${modelName}: ${error.message.substring(0, 100)}...`);
    }
  }
  console.log("No working models found with current quota.");
}

findWorkingModel();

import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const generateModels = json.models
        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name);
      console.log('--- AVAILABLE GENERATE MODELS ---');
      console.log(generateModels);
    } catch (e) {
      console.log('Error parsing response:', e.message);
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});

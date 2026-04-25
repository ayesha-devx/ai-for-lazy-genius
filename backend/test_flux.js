import dotenv from 'dotenv';
dotenv.config();

const testFLUX = async () => {
  const modelId = "black-forest-labs/FLUX.1-schnell";
  const prompt = "Professional blog cover image for: AI ML, modern, minimal, futuristic";
  
  console.log(`Testing model: ${modelId}`);

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true }
        }),
      }
    );

    console.log(`Status: ${response.status}`);
    const contentType = response.headers.get("content-type");
    console.log(`Content-Type: ${contentType}`);
    
    if (response.status === 200) {
        console.log("SUCCESS! Image received.");
    } else {
        const text = await response.text();
        console.log(`Response: ${text}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

testFLUX();

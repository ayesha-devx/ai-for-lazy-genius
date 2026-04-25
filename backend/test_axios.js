import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const testAxios = async () => {
  console.log("PROXY ENV:", {
    HTTP_PROXY: process.env.HTTP_PROXY,
    HTTPS_PROXY: process.env.HTTPS_PROXY,
    http_proxy: process.env.http_proxy,
    https_proxy: process.env.https_proxy,
    NO_PROXY: process.env.NO_PROXY
  });

  try {
    const response = await axios.get("https://api-inference.huggingface.co/");
    console.log(`HF Root Status: ${response.status}`);
  } catch (error) {
    console.log(`HF Root Error Status: ${error.response?.status}`);
  }
};

testAxios();

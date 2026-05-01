require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // The SDK doesn't have a direct listModels, but we can try to see the error or use the discovery API
    console.log("Checking Gemini API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    
    // Let's try the common models
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];
    
    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("test");
            console.log(`✅ Model ${m} is WORKING`);
        } catch (err) {
            console.log(`❌ Model ${m} FAILED: ${err.message}`);
        }
    }
  } catch (err) {
    console.error("Discovery failed:", err.message);
  }
}

listModels();

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function discoverModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Try to list models
    // Actually the SDK doesn't have listModels on the main class
    // But we can try a fetch to the discovery endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
        console.log("API Error:", data.error.message);
        return;
    }
    
    console.log("Available Models:");
    data.models.forEach(m => console.log(`- ${m.name}`));
  } catch (err) {
    console.error("Discovery failed:", err.message);
  }
}

discoverModels();

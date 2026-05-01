require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API Key found');
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const models = [
        "gemini-1.5-flash",
        "models/gemini-1.5-flash",
        "gemini-1.5-pro",
        "models/gemini-1.5-pro",
        "gemini-pro"
    ];

    for (const m of models) {
        try {
            console.log(`Checking ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const res = await model.generateContent("Hi");
            console.log(`SUCCESS: ${m} -> ${res.response.text().substring(0, 20)}...`);
        } catch (err) {
            console.log(`FAILED: ${m} - ${err.message}`);
        }
    }
}

listModels();

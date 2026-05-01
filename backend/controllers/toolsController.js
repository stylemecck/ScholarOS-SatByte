const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const User = require('../models/User');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const getAIModel = (modelName = "gemini-1.5-flash") => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    throw new Error('Gemini API Key is missing or too short. Please check your backend/.env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
};

const generateWithFallback = async (prompt) => {
  const modelsToTry = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.0-flash"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);
      const model = getAIModel(modelName);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      if (response.promptFeedback?.blockReason) {
        throw new Error(`SAFETY: ${response.promptFeedback.blockReason}`);
      }

      const text = response.text();
      if (!text) throw new Error("EMPTY_RESPONSE");
      return text;
    } catch (err) {
      console.error(`Error with ${modelName}:`, err.message);
      lastError = err;
      if (err.message.includes('404') || err.message.includes('not found') || err.message.includes('supported') || err.message.includes('503') || err.message.includes('SAFETY') || err.message.includes('EMPTY')) {
        continue; // Try next model
      }
      throw err;
    }
  }
  throw lastError;
};

exports.parsePdf = async (req, res) => {
  try {
    if (!req.file) {
      console.log("PDF Parse: No file received");
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log(`PDF Parse: Processing ${req.file.originalname} (${req.file.size} bytes)`);
    
    const data = await pdfParse(req.file.buffer);
    
    if (!data.text || data.text.trim().length === 0) {
      return res.status(422).json({ 
        error: 'No text content found in this PDF.', 
        details: 'The file might be a scanned image (requires OCR) or empty.' 
      });
    }

    console.log(`PDF Parse: Success, extracted ${data.text.length} characters`);
    res.json({ text: data.text });
  } catch (err) {
    console.error("PDF PARSE ERROR:", err);
    res.status(500).json({ 
      error: 'Failed to parse PDF', 
      details: err.message.includes('password') ? 'PDF is password protected.' : 'The file might be corrupted.'
    });
  }
};

exports.deductCredits = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.credits < amount) return res.status(403).json({ error: 'Insufficient credits', needsUpgrade: true });

    user.credits -= amount;
    user.creditHistory.push({
      type: 'spent',
      amount,
      description: reason || 'Service used',
      date: new Date()
    });
    await user.save();

    res.json({ message: 'Credits deducted successfully', remainingCredits: user.credits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to deduct credits' });
  }
};

exports.predictRank = async (req, res) => {
  try {
    const { exam, marks, category, year, isChat } = req.body;
    
    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
      if (user && user.credits < 2) {
        return res.status(403).json({ error: 'Insufficient credits. AI Analysis requires 2 credits.', needsUpgrade: true });
      }
    }

    const prompt = `As an expert in Indian competitive exams (like CUET PG, NIMCET, JEE, NEET, GATE, etc.), predict the rank, percentile, and admission chances for a student with the following details:
    - Exam: ${exam}
    - Marks: ${marks}
    - Category: ${category || 'General'}
    - Target Year: ${year || '2026'}

    Provide a realistic, data-driven approximation based on historical trends.
    Return the response strictly as a JSON object with these keys:
    - "predictedRank": (string range, e.g., "1200 - 1500")
    - "predictedPercentile": (string, e.g., "98.2")
    - "admissionChances": (string: "High", "Moderate", or "Low")
    - "suggestedColleges": (array of strings, top 3-4 colleges)
    - "confidence": (string: "High", "Medium", or "Low")
    - "analysis": (string, 1-2 sentences explaining the trend)

    Do not include markdown formatting, backticks, or any text other than the JSON object.`;

    const resultText = await generateWithFallback(prompt);
    console.log("AI Raw Response Length:", resultText?.length);

    // DEDUCT CREDIT & LOG HISTORY
    if (user) {
      user.credits -= 2; // Deduct 2 credits for analysis
      user.creditHistory.push({
        type: 'spent',
        amount: 2,
        description: `Used ${exam} AI Rank Analysis`,
        date: new Date()
      });
      await user.save();
      console.log("Credits deducted successfully");
    }
    
    // Attempt to parse JSON
    let resultJson;
    try {
      const cleaned = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      resultJson = JSON.parse(cleaned);
    } catch(e) {
      console.error("AI Parse Error:", e, resultText);
      resultJson = { predictedRank: "N/A", analysis: resultText };
    }

    res.json(resultJson);
  } catch (err) {
    console.error("RANK PREDICTION ERROR:", err);
    res.status(500).json({ error: 'AI Analysis failed.' });
  }
};

exports.predictPercentile = async (req, res) => {
  try {
    const { exam, marks, totalMarks, category, difficulty } = req.body;

    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
      if (user && user.credits < 2) {
        return res.status(403).json({ error: 'Insufficient credits. AI Analysis requires 2 credits.', needsUpgrade: true });
      }
    }

    const prompt = `Act as an expert exam data analyst. Predict the percentile for a student with these details:
    Exam: ${exam}
    Marks: ${marks} / ${totalMarks || 'Standard Total'}
    Category: ${category}
    Difficulty: ${difficulty}
    
    Based on historical trends of competitive exams in India, provide a realistic percentile analysis.
    Return ONLY a JSON object with this structure:
    {
      "percentile": "String (e.g. 98.4)",
      "range": "String (e.g. 97.5 - 99.1)",
      "performanceLevel": "Excellent" | "Good" | "Average" | "Needs Improvement",
      "betterThan": "String (X%)",
      "insights": "String (short analytical summary)",
      "suggestions": ["String", "String"],
      "confidence": "High" | "Medium" | "Low"
    }
    No explanation, no markdown, just JSON.`;

    const resultText = await generateWithFallback(prompt);
    const responseText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultJson = JSON.parse(responseText);

    if (user) {
      user.credits -= 2; // Deduct 2 credits for analysis
      user.creditHistory.push({
        type: 'spent',
        amount: 2,
        description: `Analyzed ${exam} Percentile (AI)`,
        date: new Date()
      });
      await user.save();
    }

    res.json(resultJson);
  } catch (err) {
    console.error("PERCENTILE PREDICTION ERROR:", err);
    res.status(500).json({ error: 'Failed to predict percentile' });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
    }

    const prompt = `You are the STP AI Assistant, a helpful and knowledgeable guide for the Student Toolkit Pro platform.
    Your goal is to help students with exam predictions, study planning, and career guidance.
    
    Current User Message: ${message}
    Previous Context: ${JSON.stringify(history || [])}

    Provide a concise, encouraging, and accurate response. If they ask about exam ranks, suggest they use the specific Rank Predictor tool on the platform.
    Keep the response under 100 words.`;

    const resultText = await generateWithFallback(prompt);

    // Optional: Deduct 1 credit for chat if logged in
    if (user && user.credits > 0) {
      user.credits -= 1;
      user.creditHistory.push({
        type: 'spent',
        amount: 1,
        description: 'AI Chat Assistant query',
        date: new Date()
      });
      await user.save();
    }

    res.json({ response: resultText.trim(), remainingCredits: user?.credits });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: 'AI Chat failed.' });
  }
};

exports.generateResumeSummary = async (req, res) => {
  try {
    const { jobTitle, skills, experience } = req.body;
    const prompt = `Write a professional, impactful 2-3 sentence resume summary for a ${jobTitle}. 
    Key skills: ${skills.join(', ')}. 
    Experience context: ${experience}.
    Make it ATS-friendly and focused on value delivery.
    Return only the summary text without quotes or extra explanation.`;

    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
      if (user && user.credits < 1) {
        return res.status(403).json({ error: 'Insufficient credits', needsUpgrade: true });
      }
    }

    const result = await generateWithFallback(prompt);
    
    if (user) {
      user.credits -= 1;
      user.creditHistory.push({
        type: 'spent',
        amount: 1,
        description: `Generated Resume Summary for ${jobTitle}`,
        date: new Date()
      });
      await user.save();
    }
    
    res.json({ summary: result.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

exports.enhanceResumeBullet = async (req, res) => {
  try {
    const { bulletText } = req.body;
    const prompt = `Rewrite the following resume bullet point to be more professional, action-oriented, and impact-focused. 
    Use strong action verbs and include metrics/results if implied.
    Original: "${bulletText}"
    Return only the enhanced bullet point without quotes.`;

    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
      if (user && user.credits < 1) {
        return res.status(403).json({ error: 'Insufficient credits', needsUpgrade: true });
      }
    }

    const result = await generateWithFallback(prompt);
    
    if (user) {
      user.credits -= 1;
      user.creditHistory.push({
        type: 'spent',
        amount: 1,
        description: 'Enhanced Resume Bullet Point',
        date: new Date()
      });
      await user.save();
    }

    res.json({ enhanced: result.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to enhance bullet point' });
  }
};

exports.saveResult = async (req, res) => {
  try {
    const { toolName, data } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.savedResults.push({ toolName, data });
    await user.save();

    res.json({ message: 'Result saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save result' });
  }
};

exports.generatePdf = async (req, res) => {
  try {
    const { html } = req.body;
    const timestamp = Date.now();
    const outputPath = path.join(__dirname, `../temp_resume_${timestamp}.pdf`);
    // Placeholder for real PDF generation logic if needed
    res.json({ message: 'PDF logic triggered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

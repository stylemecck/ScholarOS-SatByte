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
      return response.text();
    } catch (err) {
      console.error(`Error with ${modelName}:`, err.message);
      lastError = err;
      if (err.message.includes('404') || err.message.includes('not found') || err.message.includes('supported')) {
        continue; // Try next model
      }
      throw err;
    }
  }
  throw lastError;
};

exports.parsePdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
};

exports.predictRank = async (req, res) => {
  try {
    const { exam, marks, category, year } = req.body;
    
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

    // DEDUCT CREDIT & LOG HISTORY
    if (req.user) {
      const user = await User.findById(req.user.userId);
      if (user) {
        user.credits -= 1;
        user.creditHistory.push({
          type: 'spent',
          amount: 1,
          description: `Used ${exam} Rank Predictor`,
          date: new Date()
        });
        await user.save();
      }
    }
    
    // Attempt to parse JSON
    let resultJson;
    try {
      const cleaned = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      resultJson = JSON.parse(cleaned);
    } catch(e) {
      console.error("AI Parse Error:", e, resultText);
      // Fallback
      resultJson = { 
        predictedRank: "N/A", 
        predictedPercentile: "N/A", 
        admissionChances: "Low", 
        suggestedColleges: [], 
        confidence: "Low",
        analysis: "Could not generate precise analysis."
      };
    }

    res.json(resultJson);
  } catch (err) {
    console.error("AI PREDICTION ERROR:", err);
    res.status(500).json({ 
      error: 'Failed to predict rank using AI', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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
        description: `Generated Resume Summary for ${jobTitle}`
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
        description: 'Enhanced Resume Bullet Point'
      });
      await user.save();
    }

    res.json({ enhanced: result.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to enhance bullet point' });
  }
};

exports.predictPercentile = async (req, res) => {
  try {
    const { exam, marks, totalMarks, category, difficulty } = req.body;

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

    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
      if (user && user.credits < 1) {
        return res.status(403).json({ error: 'Insufficient credits', needsUpgrade: true });
      }
    }

    const resultText = await generateWithFallback(prompt);
    const responseText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultJson = JSON.parse(responseText);

    if (user) {
      user.credits -= 1;
      user.creditHistory.push({
        type: 'spent',
        amount: 1,
        description: `Analyzed ${exam} Percentile`
      });
      await user.save();
    }

    res.json(resultJson);
  } catch (err) {
    console.error("PERCENTILE PREDICTION ERROR:", err);
    res.status(500).json({ error: 'Failed to predict percentile' });
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
    const scriptPath = path.join(__dirname, '../scripts/generate_pdf.py');

    // Spawn python process
    const pythonProcess = spawn('python', [scriptPath, outputPath]);

    let errorData = '';
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error(`Python Error: ${data}`);
    });

    // Send HTML via stdin
    pythonProcess.stdin.write(html);
    pythonProcess.stdin.end();

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.download(outputPath, 'resume.pdf', (err) => {
          if (err) {
            console.error("Download Error:", err);
            if (!res.headersSent) res.status(500).json({ error: 'Failed to send PDF' });
          }
          // Delete temp file after download
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
      } else {
        console.error(`Python process exited with code ${code}. Error: ${errorData}`);
        res.status(500).json({ error: 'Failed to generate PDF', details: errorData });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
};

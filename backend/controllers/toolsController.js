const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const User = require('../models/User');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const predictor = require('../utils/predictor');
const percentileService = require('../services/percentileService');
const { EXAM_CONFIG } = require('../utils/examConfig');

const getAIModel = (modelName = "gemini-1.5-flash") => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    throw new Error('Gemini API Key is missing or too short. Please check your backend/.env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
};

const generateWithFallback = async (prompt) => {
  const modelsToTry = [
    "gemini-3-flash-preview", 
    "gemini-2.5-flash", 
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite", // Lite models often have higher quotas
    "gemini-flash-lite-latest"
  ];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[AI] Attempting generation with: ${modelName}...`);
      const model = getAIModel(modelName);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      if (response.promptFeedback?.blockReason) {
        throw new Error(`SAFETY: ${response.promptFeedback.blockReason}`);
      }

      const text = response.text();
      if (!text) throw new Error("EMPTY_RESPONSE");
      
      console.log(`[AI] Success with ${modelName}`);
      return text;
    } catch (err) {
      console.warn(`[AI] ${modelName} unavailable: ${err.message.substring(0, 50)}...`);
      lastError = err;
      continue; 
    }
  }
  throw lastError;
};

const callPythonAnalysis = async (exam, marks, category = 'General', year = '2026', totalMarks = null) => {
  return new Promise((resolve, reject) => {
    const args = [path.join(__dirname, '../utils/analysis.py'), exam, marks, category, year];
    if (totalMarks) args.push(totalMarks);
    
    const pythonProcess = spawn('python', args);
    let data = '';
    pythonProcess.stdout.on('data', (chunk) => data += chunk);
    pythonProcess.stderr.on('data', (chunk) => console.error('Python Error:', chunk.toString()));
    pythonProcess.on('close', (code) => {
      if (code !== 0) return resolve(null);
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve(null);
      }
    });
  });
};

exports.getExamsConfig = async (req, res) => {
  try {
    // Sort alphabetically by name
    const config = [...EXAM_CONFIG].sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exam configurations' });
  }
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
  const { exam, marks, category, year, totalMarks } = req.body;
  let localResult = null;
  let suggestedColleges = [];

  try {
    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
      if (user && user.credits < 2) {
        return res.status(403).json({ error: 'Insufficient credits. AI Analysis requires 2 credits.', needsUpgrade: true });
      }
    }
    
    // Pre-calculate local data with category, year and totalMarks
    localResult = await callPythonAnalysis(exam, marks, category || 'General', year || '2026', totalMarks);
    if (!localResult) localResult = predictor.predictLocal(exam, marks);
    suggestedColleges = predictor.getSuggestions(exam, marks, localResult?.predictedRank, localResult?.predictedPercentile);

    // Build college context for AI from local data
    const collegeContext = localResult?.collegeDetails ? 
      localResult.collegeDetails.map(c => 
        `${c.name} | Location: ${c.location || 'N/A'} | Fee: ${c.fee || 'N/A'} | Seats: ${c.totalSeats || 'N/A'} | Cutoff: ${c.cutoffGeneral || 'N/A'} | Placement: ${c.avgPlacement || 'N/A'} | NAAC: ${c.naacGrade || 'N/A'}`
      ).join('\n      ') : '';

    const spotContext = localResult?.spotRoundAnalysis?.summary ? 
      JSON.stringify(localResult.spotRoundAnalysis.summary) : '';

    const difficultyContext = localResult?.paperDifficultyAnalysis?.paperInsight || '';

    const prompt = `You are an expert counselor for Indian competitive exams. Generate a COMPREHENSIVE counseling-style analysis.

    STUDENT DATA:
    - Exam: ${exam}, Marks: ${marks}, Category: ${category || 'General'}, Year: ${year || '2026'}
    ${localResult ? `- Predicted Rank: ${localResult.predictedRank}, Percentile: ${localResult.predictedPercentile}%` : ''}
    ${difficultyContext ? `- Paper Difficulty: ${difficultyContext}` : ''}
    
    ELIGIBLE COLLEGES (verified data - use these EXACTLY):
    ${collegeContext || suggestedColleges.join(', ')}
    
    ${spotContext ? `COUNSELING ROUND DATA: ${spotContext}` : ''}

    Return ONLY a JSON object with this EXACT structure (no markdown, no backticks):
    {
      "predictedRank": "rank range",
      "predictedPercentile": "percentile with suffix",
      "admissionChances": "Very High/High/Moderate/Low/Very Low",
      "suggestedColleges": ["top 3 college names from the data above"],
      "confidence": "High (AI + Local Data)",
      "analysis": "Write 3-4 sentences covering: 1) rank/percentile assessment, 2) paper difficulty context, 3) which colleges to target and in which counseling round, 4) spot round advice if applicable. Make it sound like a professional counselor giving personalized advice."
    }`;

    const resultText = await generateWithFallback(prompt);
    
    const cleaned = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiResult = JSON.parse(cleaned);
    
    // Deduct credits and Save Result
    if (user) {
      user.credits -= 2;
      user.creditHistory.push({ type: 'spent', amount: 2, description: `Used ${exam} AI Analysis`, date: new Date() });
      
      // Save to history automatically
      user.savedResults.push({
        toolName: 'Rank Predictor',
        data: { ...req.body, ...aiResult, 
          collegeDetails: localResult?.collegeDetails || [],
          paperDifficultyAnalysis: localResult?.paperDifficultyAnalysis || null,
          spotRoundAnalysis: localResult?.spotRoundAnalysis || null
        },
        date: new Date()
      });

      await user.save();
    }
    
    // Merge AI analysis with rich local data (college details, difficulty, spot rounds)
    return res.json({
      ...aiResult,
      collegeDetails: localResult?.collegeDetails || [],
      paperDifficultyAnalysis: localResult?.paperDifficultyAnalysis || null,
      spotRoundAnalysis: localResult?.spotRoundAnalysis || null,
      historicalContext: localResult?.historicalContext || null
    });

  } catch (err) {
    console.error("AI FAILED, FALLING BACK TO LOCAL:", err.message);
    
    // FALLBACK TO LOCAL MODEL — now returns full counseling-style data
    if (localResult) {
      return res.json({
        ...localResult,
        suggestedColleges: localResult.suggestedColleges?.length > 0 ? localResult.suggestedColleges : suggestedColleges,
        confidence: "High (Local 10-Year Archive)"
      });
    }

    res.status(500).json({ error: 'Prediction failed.', details: err.message });
  }
};

exports.predictPercentile = async (req, res) => {
  const { exam, marks } = req.body;

  try {
    const result = percentileService.getPercentile(exam, marks);
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    // Optional: Log usage or deduct credits here if required by platform policy
    
    res.json(result);
  } catch (err) {
    console.error("PERCENTILE ENGINE FAILED:", err.message);
    res.status(500).json({ error: 'Internal engine error during percentile calculation' });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
    }

    const prompt = `You are the ScholarOS Copilot, a helpful and knowledgeable guide for the ScholarOS platform.
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
    const summary = result.trim();
    
    if (user) {
      user.credits -= 1;
      user.creditHistory.push({
        type: 'spent',
        amount: 1,
        description: `Generated Resume Summary for ${jobTitle}`,
        date: new Date()
      });

      // Save to history automatically
      user.savedResults.push({
        toolName: 'Resume AI Summary',
        data: { jobTitle, summary },
        date: new Date()
      });

      await user.save();
    }
    
    res.json({ summary });
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
    const enhanced = result.trim();
    
    if (user) {
      user.credits -= 1;
      user.creditHistory.push({
        type: 'spent',
        amount: 1,
        description: 'Enhanced Resume Bullet Point',
        date: new Date()
      });

      // Save to history automatically
      user.savedResults.push({
        toolName: 'Resume Bullet Enhancer',
        data: { original: bulletText, enhanced },
        date: new Date()
      });

      await user.save();
    }

    res.json({ enhanced });
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

exports.deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.savedResults = user.savedResults.filter(r => r._id.toString() !== id);
    await user.save();

    res.json({ message: 'Result deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete result' });
  }
};

const os = require('os');

exports.generatePdf = async (req, res) => {
  res.status(501).json({ error: 'Standard PDF generation not implemented. Use specific tool export instead.' });
};

exports.exportCounselingPdf = async (req, res) => {
  try {
    const { predictionData, userData } = req.body;
    const timestamp = Date.now();
    const tempFileName = `counseling_report_${timestamp}.pdf`;
    
    const tempDir = os.tmpdir();
    const outputPath = path.join(tempDir, tempFileName);
    const inputDataPath = path.join(tempDir, `input_${timestamp}.json`);

    const pythonData = {
      ...predictionData,
      userName: userData.name,
      outputPath: outputPath
    };

    fs.writeFileSync(inputDataPath, JSON.stringify(pythonData));

    const startPythonProcess = (cmd) => {
      return spawn(cmd, [
        path.join(__dirname, '../utils/pdf_generator.py'),
        inputDataPath
      ]);
    };

    let pythonProcess = startPythonProcess('python');

    pythonProcess.on('error', (err) => {
      console.warn(`'python' command failed, trying 'py'...`);
      pythonProcess = startPythonProcess('py');
      
      pythonProcess.on('error', (err2) => {
        console.error('All Python commands failed:', err2);
        if (fs.existsSync(inputDataPath)) fs.unlinkSync(inputDataPath);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Python environment not found. Please ensure Python is installed and in PATH.' });
        }
      });

      setupProcessListeners(pythonProcess);
    });

    const setupProcessListeners = (proc) => {
      let errorData = '';
      let stdoutData = '';
      proc.stderr.on('data', (data) => errorData += data.toString());
      proc.stdout.on('data', (data) => stdoutData += data.toString());
      
      proc.on('close', (code) => {
        if (fs.existsSync(inputDataPath)) fs.unlinkSync(inputDataPath);

        if (code !== 0 || stdoutData.startsWith('ERROR:')) {
          const fullError = errorData || stdoutData;
          console.error('Python PDF Error:', fullError);
          if (!res.headersSent) {
            res.status(500).json({ 
              error: 'Failed to generate PDF', 
              details: fullError,
              code: code 
            });
          }
          return;
        }

        if (fs.existsSync(outputPath)) {
          res.download(outputPath, `Counseling_Report.pdf`, (err) => {
            if (err) console.error('Download Error:', err);
            try {
              if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            } catch (unlinkErr) {
              console.error('Unlink Error:', unlinkErr);
            }
          });
        } else {
          if (!res.headersSent) {
            res.status(500).json({ error: 'PDF file was not created', details: stdoutData });
          }
        }
      });
    };

    if (pythonProcess) {
      setupProcessListeners(pythonProcess);
    }


  } catch (err) {
    console.error('PDF Export Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error during PDF export' });
    }
  }
};

exports.exportResumePdf = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const timestamp = Date.now();
    const tempFileName = `resume_${timestamp}.pdf`;
    
    const tempDir = os.tmpdir();
    const outputPath = path.join(tempDir, tempFileName);
    const inputDataPath = path.join(tempDir, `resume_input_${timestamp}.json`);

    const pythonData = {
      ...resumeData,
      outputPath: outputPath
    };

    fs.writeFileSync(inputDataPath, JSON.stringify(pythonData));

    const startPythonProcess = (cmd) => {
      return spawn(cmd, [
        path.join(__dirname, '../utils/resume_generator.py'),
        inputDataPath
      ]);
    };

    let pythonProcess = startPythonProcess('python');

    pythonProcess.on('error', (err) => {
      pythonProcess = startPythonProcess('py');
      setupProcessListeners(pythonProcess);
    });

    const setupProcessListeners = (proc) => {
      let errorData = '';
      let stdoutData = '';
      proc.stderr.on('data', (data) => errorData += data.toString());
      proc.stdout.on('data', (data) => stdoutData += data.toString());
      
      proc.on('close', (code) => {
        if (fs.existsSync(inputDataPath)) fs.unlinkSync(inputDataPath);

        if (code !== 0 || stdoutData.startsWith('ERROR:')) {
          console.error('Python Resume Error:', errorData || stdoutData);
          if (!res.headersSent) res.status(500).json({ error: 'Failed to generate resume PDF' });
          return;
        }

        if (fs.existsSync(outputPath)) {
          res.download(outputPath, `Resume.pdf`, (err) => {
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
          });
        } else {
          if (!res.headersSent) res.status(500).json({ error: 'PDF file was not created' });
        }
      });
    };

    if (pythonProcess) setupProcessListeners(pythonProcess);

  } catch (err) {
    console.error('Resume Export Error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Server error during resume export' });
  }
};

const Document = require('../models/Document');
const User = require('../models/User');
const pdfParse = require('pdf-parse');
const { getAIModel, getModelForPlan, cleanAndParseJson } = require('../utils/aiHelper');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const fileName = req.file.originalname;
    const fileSize = req.file.size;

    // Validate size limit based on plan
    const userPlan = user.plan || 'Free';
    let sizeLimit = 10 * 1024 * 1024; // 10MB default
    if (userPlan === 'Pro') sizeLimit = 50 * 1024 * 1024; // 50MB
    else if (userPlan === 'Ultimate' || userPlan === 'Enterprise') sizeLimit = 100 * 1024 * 1024; // 100MB

    if (fileSize > sizeLimit) {
      return res.status(400).json({ 
        error: `File size exceeds the limit for your ${userPlan} plan. Please upgrade to upload larger files.` 
      });
    }
    const mime = req.file.mimetype;
    let fileType = 'txt';
    let textContent = '';

    if (mime.includes('pdf')) {
      fileType = 'pdf';
      const parsed = await pdfParse(req.file.buffer);
      textContent = parsed.text;
    } else if (mime.includes('image')) {
      fileType = 'image';
      // Multimodal vision OCR using Gemini
      console.log(`[AI PDF OCR] Extracting text from image via Gemini: ${fileName}`);
      const model = getAIModel("gemini-1.5-flash");
      const prompt = "Extract all readable text, titles, values, tables, and details from this image. Keep it structured and return only the text content.";
      const result = await model.generateContent([
        {
          inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType: mime
          }
        },
        prompt
      ]);
      textContent = (await result.response).text() || 'No text found in image.';
    } else if (mime.includes('text') || mime.includes('txt')) {
      fileType = 'txt';
      textContent = req.file.buffer.toString('utf-8');
    } else {
      // General fallback (treat as txt or read buffer)
      fileType = fileName.split('.').pop() || 'txt';
      textContent = req.file.buffer.toString('utf-8');
    }

    if (!textContent || textContent.trim().length === 0) {
      textContent = `Empty text content extracted from file: ${fileName}`;
    }

    const doc = new Document({
      user: req.user.userId,
      fileName,
      fileType,
      fileSize,
      textContent,
      folder: req.body.folder || null
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error("Document upload/parsing error:", err);
    res.status(500).json({ error: 'Failed to process document', details: err.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.userId }).sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.user.userId });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    doc.isFavorite = !doc.isFavorite;
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle favorite status' });
  }
};

exports.chatWithDocument = async (req, res) => {
  try {
    const { docId, message } = req.body;
    if (!docId || !message) return res.status(400).json({ error: 'Document ID and message are required' });

    const doc = await Document.findOne({ _id: docId, user: req.user.userId });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const user = await User.findById(req.user.userId);
    if (user && user.credits < 1) {
      return res.status(403).json({ error: 'Insufficient credits', needsUpgrade: true });
    }

    const docContext = doc.textContent.substring(0, 15000); // safety length for standard models
    const prompt = `You are a document reading assistant. Answer questions based on the document provided.
DOCUMENT TEXT CONTEXT:
${docContext}

STUDENT QUERY:
${message}

Respond in markdown. If the question cannot be answered using the text context, rely on your knowledge base but clearly note it.`;

    const modelName = getModelForPlan(user?.plan);
    const model = getAIModel(modelName);
    const result = await model.generateContent(prompt);
    const answer = (await result.response).text() || 'I could not parse a response.';

    if (user) {
      user.credits -= 1;
      user.creditHistory.push({
        type: 'spent',
        amount: 1,
        description: `Chatted with PDF: ${doc.fileName}`
      });
      await user.save();
    }

    res.json({ answer });
  } catch (err) {
    console.error("PDF Chat error:", err);
    res.status(500).json({ error: 'AI Document analysis failed' });
  }
};

exports.compareDocuments = async (req, res) => {
  try {
    const { docIdA, docIdB } = req.body;
    if (!docIdA || !docIdB) return res.status(400).json({ error: 'Two document IDs are required' });

    const docA = await Document.findOne({ _id: docIdA, user: req.user.userId });
    const docB = await Document.findOne({ _id: docIdB, user: req.user.userId });

    if (!docA || !docB) return res.status(404).json({ error: 'One or both documents not found' });

    const user = await User.findById(req.user.userId);
    if (user && user.credits < 2) {
      return res.status(403).json({ error: 'Insufficient credits. Requires 2 credits.', needsUpgrade: true });
    }

    const contextA = docA.textContent.substring(0, 8000);
    const contextB = docB.textContent.substring(0, 8000);

    const prompt = `You are a comparative literature and academic analyst. Compare the following two files side by side:
FILE A: "${docA.fileName}"
Content snippet:
${contextA}

FILE B: "${docB.fileName}"
Content snippet:
${contextB}

Provide a comparative analysis including:
1. Core thematic similarities.
2. Distinct discrepancies/contradictions.
3. Comparative tabular summary of key differences.
4. Summary evaluation.

Format in markdown.`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    const comparison = (await result.response).text();

    if (user) {
      user.credits -= 2;
      user.creditHistory.push({
        type: 'spent',
        amount: 2,
        description: `Compared docs: ${docA.fileName} & ${docB.fileName}`
      });
      await user.save();
    }

    res.json({ comparison });
  } catch (err) {
    console.error("Document compare error:", err);
    res.status(500).json({ error: 'Comparative analysis failed' });
  }
};

exports.generateDocumentFeatures = async (req, res) => {
  try {
    const { docId, type } = req.body; // type = 'summary' | 'flashcards' | 'quiz' | 'citations'
    const doc = await Document.findOne({ _id: docId, user: req.user.userId });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const user = await User.findById(req.user.userId);
    if (user && user.credits < 1) {
      return res.status(403).json({ error: 'Insufficient credits', needsUpgrade: true });
    }

    const context = doc.textContent.substring(0, 15000);
    let prompt = '';

    if (type === 'summary') {
      prompt = `Summarize the following document details into high-yield study notes, complete with key definitions, formulas, and structured bullet points.\nCONTEXT:\n${context}`;
    } else if (type === 'flashcards') {
      prompt = `Generate a set of 8 useful flashcards from this document. Format as a strict JSON array of objects containing 'question' and 'answer':\n[\n  { "question": "...", "answer": "..." }\n]\nCONTEXT:\n${context}`;
    } else if (type === 'quiz') {
      prompt = `Create a 5-question multiple choice quiz from this document. Format as a strict JSON array of objects containing 'question', 'options' (array of 4 strings), and 'correctIndex' (number 0-3):\n[\n  { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0 }\n]\nCONTEXT:\n${context}`;
    } else if (type === 'citations') {
      prompt = `Create bibliographical citation records for this document: "${doc.fileName}" in APA, MLA, and Chicago styles.\nCONTEXT SNIPPET:\n${context.substring(0, 2000)}`;
    } else {
      return res.status(400).json({ error: 'Invalid features type' });
    }

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let outputText = (await result.response).text().trim();

    let outputData = outputText;
    if (type === 'flashcards' || type === 'quiz') {
      try {
        outputData = cleanAndParseJson(outputText);
      } catch (parseErr) {
        console.warn("JSON parsing failed for AI generator, sending raw text fallback.");
      }
    }

    if (user) {
      user.credits -= 1;
      user.creditHistory.push({
        type: 'spent',
        amount: 1,
        description: `Generated AI ${type} for ${doc.fileName}`
      });
      await user.save();
    }

    res.json({ result: outputData });
  } catch (err) {
    console.error("Document features generation error:", err);
    res.status(500).json({ error: 'Failed to generate content', details: err.message });
  }
};

exports.addAnnotation = async (req, res) => {
  try {
    const { page, type, color, text, comment } = req.body;
    const doc = await Document.findOne({ _id: req.params.id, user: req.user.userId });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    doc.annotations.push({ page, type, color, text, comment });
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add annotation' });
  }
};

exports.updateReadingProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const doc = await Document.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { readingProgress: Math.min(Math.max(progress, 0), 100) },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

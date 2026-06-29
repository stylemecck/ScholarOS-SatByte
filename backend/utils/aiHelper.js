const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Get an instance of the Google Generative AI model.
 * @param {string} modelName
 * @returns {any}
 */
const getAIModel = (modelName = "gemini-1.5-flash") => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    throw new Error('Gemini API Key is missing or too short. Please check your backend/.env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  
  return {
    generateContent: async (prompt, ...args) => {
      const modelsToTry = [
        modelName,
        "gemini-2.5-flash",
        "gemini-3.5-flash",
        "gemini-flash-latest",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
      ];
      const uniqueModels = [...new Set(modelsToTry.filter(Boolean))];
      let lastError = null;
      for (const m of uniqueModels) {
        try {
          console.log(`[AI Helper Wrapper] Trying model: ${m}`);
          const actualModel = genAI.getGenerativeModel({ model: m });
          const result = await actualModel.generateContent(prompt, ...args);
          if (result && result.response) {
            console.log(`[AI Helper Wrapper] Success with model: ${m}`);
            return result;
          }
        } catch (err) {
          console.warn(`[AI Helper Wrapper] Model ${m} failed:`, err.message);
          lastError = err;
        }
      }
      throw lastError || new Error("All fallback generative models failed");
    }
  };
};

/**
 * Maps the user plan to a corresponding Gemini model.
 * @param {string} plan - Free, Pro, etc.
 * @returns {string}
 */
const getModelForPlan = (plan = 'Free') => {
  // Use actual working models for this API key: gemini-2.5-flash for free tier, gemini-2.5-pro for paid tiers
  return plan === 'Free' ? 'gemini-2.5-flash' : 'gemini-2.5-pro';
};

/**
 * Robustly extracts and parses JSON content from AI responses.
 * Handles markdown fences, preambles, and postludes.
 * @param {string} text
 * @returns {any}
 */
const cleanAndParseJson = (text) => {
  if (!text) throw new Error("Empty text input");
  
  // Remove markdown code fences if present
  let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  
  // Try parsing directly
  try {
    return JSON.parse(cleanText);
  } catch (e) {}

  // Find start of JSON structure
  const firstBracket = cleanText.indexOf('[');
  const firstBrace = cleanText.indexOf('{');
  
  let startIdx = -1;
  
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    startIdx = firstBracket;
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  }
  
  if (startIdx !== -1) {
    const potentialJson = cleanText.substring(startIdx);
    
    // First, try standard parsing of the substring
    try {
      return JSON.parse(potentialJson);
    } catch (e) {}
    
    // Auto-repair/close truncated JSON strings and braces
    try {
      let clean = potentialJson.trim();
      let inString = false;
      let escaped = false;
      let braces = [];
      let repaired = "";
      
      for (let i = 0; i < clean.length; i++) {
        const char = clean[i];
        repaired += char;
        
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === '\\') {
          escaped = true;
          continue;
        }
        if (char === '"') {
          inString = !inString;
          continue;
        }
        if (!inString) {
          if (char === '{' || char === '[') {
            braces.push(char);
          } else if (char === '}') {
            if (braces[braces.length - 1] === '{') braces.pop();
          } else if (char === ']') {
            if (braces[braces.length - 1] === '[') braces.pop();
          }
        }
      }
      
      // Auto-close string if left open
      if (inString) {
        repaired += '"';
      }
      
      // Auto-close braces/brackets in reverse order
      while (braces.length > 0) {
        const last = braces.pop();
        if (last === '{') repaired += '}';
        else if (last === '[') repaired += ']';
      }
      
      return JSON.parse(repaired);
    } catch (e) {}
  }

  throw new Error("Unable to parse JSON from AI response: " + text.substring(0, 150));
};

module.exports = {
  getAIModel,
  getModelForPlan,
  cleanAndParseJson
};

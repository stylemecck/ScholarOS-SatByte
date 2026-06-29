const Chat = require('../models/Chat');
const User = require('../models/User');
const { getAIModel, getModelForPlan } = require('../utils/aiHelper');

// Mode-specific instructions helper
const getModeInstructions = (mode) => {
  switch (mode) {
    case 'Explain Topic':
      return "Explain the topic clearly with simple analogies, structured bullet points, and key definitions.";
    case 'Solve Doubt':
      return "Analyze the student's doubt. Break down the core issue, solve step-by-step, and explain the 'why' behind each step.";
    case 'Homework Helper':
      return "Provide guidance on how to solve the homework problem, pointing out formulas, logic, and solutions, but also teaching the underlying concepts.";
    case 'Exam Preparation':
      return "Format your response to emphasize exam relevance. Highlight potential exam questions, key terms to memorize, and revision strategies.";
    case 'Concept Simplifier':
      return "Explain this as if I am 10 years old. Use simple language, zero jargon, and concrete everyday examples.";
    case 'Research Assistant':
      return "Provide academic, detailed sources, logical arguments, citations guidelines (APA/MLA), and deep dive facts.";
    case 'Coding Mentor':
      return "Provide optimized code blocks with clear inline comments. Explain time/space complexity, syntax highlights, and debugging tips.";
    case 'Revision Mode':
      return "Summarize core points, generate a quick 3-bullet cheat sheet, and ask 2 short interactive check questions at the end.";
    default:
      return "Provide helpful, educational assistance.";
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.userId }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { title, mode, folder } = req.body;
    const chat = new Chat({
      user: req.user.userId,
      title: title || 'New Session',
      mode: mode || 'Explain Topic',
      folder: folder || null,
      messages: []
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user.userId });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chat details' });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { text, mode } = req.body;
    const chatId = req.params.id;

    const chat = await Chat.findOne({ _id: chatId, user: req.user.userId });
    if (!chat) return res.status(404).json({ error: 'Chat session not found' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Premium Check (20 messages/day limit on Free)
    if (user.plan === 'Free') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Count user messages sent in all chats since start of day
      const todayChats = await Chat.find({ user: req.user.userId });
      let messageCount = 0;
      todayChats.forEach(c => {
        c.messages.forEach(m => {
          if (m.sender === 'user' && m.timestamp >= startOfDay) {
            messageCount++;
          }
        });
      });

      if (messageCount >= 20) {
        return res.status(403).json({
          error: 'Daily limit reached',
          message: 'Free tier users are limited to 20 messages per day. Please upgrade to Pro or Ultimate for unlimited access.',
          limitReached: true
        });
      }
    }

    // Set active mode if updated
    const activeMode = mode || chat.mode || 'Explain Topic';
    chat.mode = activeMode;

    // Append user message
    chat.messages.push({
      sender: 'user',
      text,
      mode: activeMode
    });

    // Build model prompts using memory and history context
    const modeInstructions = getModeInstructions(activeMode);
    const historyContext = chat.messages.slice(-10, -1).map(m => 
      `${m.sender === 'user' ? 'Student' : 'Assistant'}: ${m.text}`
    ).join('\n');

    const prompt = `You are Scholar OS AI Study Assistant.
Academic Mode: ${activeMode}
Mode Instructions: ${modeInstructions}

Previous Context Memory: ${chat.memory || 'None'}

Conversation History:
${historyContext}

Student's Current Query:
${text}

Respond in clean markdown, supporting math equations (in $...$ or $$...$$ LaTeX formatting), tables, mermaid diagrams (using \`\`\`mermaid blocks), and code syntax highlighting. Keep details high-quality, encouraging, and accurate. Make sure any code examples are robust.`;

    const modelName = getModelForPlan(user.plan);
    const model = getAIModel(modelName);

    console.log(`[Chat Assistant] Sending query to ${modelName} with mode: ${activeMode}`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text() || "I apologize, but I encountered an error formulating a response.";

    // Append assistant response
    chat.messages.push({
      sender: 'assistant',
      text: aiText,
      mode: activeMode
    });

    // Update session update time
    chat.updatedAt = new Date();

    // Summarize context memory buffer asynchronously if conversation grows
    if (chat.messages.length % 6 === 0) {
      try {
        const memoryPrompt = `Summarize the essential learning facts and topics discussed so far in 2 sentences. 
        Current Context: ${chat.memory || 'None'}
        Recent messages: ${JSON.stringify(chat.messages.slice(-6))}`;
        const summaryModel = getAIModel("gemini-1.5-flash");
        const summaryResult = await summaryModel.generateContent(memoryPrompt);
        chat.memory = (await summaryResult.response).text();
      } catch (memErr) {
        console.warn("Failed to update chat memory buffer:", memErr.message);
      }
    }

    await chat.save();
    res.json({ chat, reply: aiText });
  } catch (err) {
    console.error("Chat Message Error:", err);
    res.status(500).json({ error: 'Failed to process AI chat message', details: err.message });
  }
};

exports.renameChat = async (req, res) => {
  try {
    const { title } = req.body;
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, updatedAt: new Date() },
      { new: true }
    );
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to rename chat' });
  }
};

exports.organizeFolder = async (req, res) => {
  try {
    const { folder } = req.body;
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { folder, updatedAt: new Date() },
      { new: true }
    );
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to organize chat' });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const { getAIModel } = require('../utils/aiHelper');

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.userId });
    res.json(roadmaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch career roadmaps' });
  }
};

exports.suggestRoadmap = async (req, res) => {
  try {
    const { title, currentSkills, goalTime } = req.body;
    if (!title) return res.status(400).json({ error: 'Target career title is required' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate roadmap limit per plan
    const roadmapCount = await Roadmap.countDocuments({ user: req.user.userId });
    const userPlan = user.plan || 'Free';
    let roadmapLimit = 1; // Free
    if (userPlan === 'Pro') roadmapLimit = 5;
    else if (userPlan === 'Ultimate' || userPlan === 'Enterprise') roadmapLimit = 50;

    if (roadmapCount >= roadmapLimit) {
      return res.status(403).json({ 
        error: `You have reached the limit of ${roadmapLimit} career roadmap(s) for your ${userPlan} plan. Please delete existing roadmaps or upgrade your plan to generate more.` 
      });
    }

    if (user.credits < 8) {
      return res.status(403).json({ error: 'Insufficient credits. Requires 8 credits.', needsUpgrade: true });
    }

    const prompt = `You are an expert career counselor and engineering advisor. 
Create a highly personalized skill timeline for a student targeting the role: "${title}".
Current Skills: ${currentSkills || 'None'}
Timeline Goal: ${goalTime || '6 months'}

Provide:
1. Customized week-by-week learning milestones.
2. Recommended books, courses, and documentation sites.
3. Relevant portfolio projects with high resumes impact.
4. Salary insights in USD and INR.
5. List of top hiring companies.
6. Portfolio requirements check items.

Format your output in clean Markdown.`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    const suggestionText = (await result.response).text();

    if (user) {
      user.credits -= 8;
      user.creditHistory.push({
        type: 'spent',
        amount: 8,
        description: `Career roadmap query for ${title}`
      });
      await user.save();
    }

    // Automatically save as a document record in user docs
    try {
      const Document = require('../models/Document');
      const docName = `${title.replace(/\s+/g, '_')}_Career_Roadmap.txt`;
      
      const newDoc = new Document({
        user: req.user.userId,
        fileName: docName,
        fileType: 'txt',
        fileSize: Buffer.byteLength(suggestionText, 'utf8'),
        textContent: suggestionText,
        readingProgress: 0
      });
      await newDoc.save();
    } catch (docErr) {
      console.warn("Failed to automatically archive roadmap report as document:", docErr.message);
    }

    res.json({ advice: suggestionText });
  } catch (err) {
    console.error("AI Career Advisor Error:", err);
    res.status(500).json({ error: 'Failed to retrieve recommendations from AI Career Advisor' });
  }
};

exports.toggleNode = async (req, res) => {
  try {
    const { title, nodeId, totalNodesCount } = req.body;
    if (!title || !nodeId) return res.status(400).json({ error: 'Roadmap title and node ID are required' });

    let roadmap = await Roadmap.findOne({ user: req.user.userId, title });

    if (!roadmap) {
      roadmap = new Roadmap({
        user: req.user.userId,
        title,
        completedNodes: [],
        progress: 0
      });
    }

    const index = roadmap.completedNodes.indexOf(nodeId);
    if (index > -1) {
      roadmap.completedNodes.splice(index, 1);
    } else {
      roadmap.completedNodes.push(nodeId);
    }

    // Recalculate progress percentage
    const count = totalNodesCount || 10; // Default estimate if not supplied
    roadmap.progress = Math.round((roadmap.completedNodes.length / count) * 100);
    roadmap.progress = Math.min(roadmap.progress, 100);

    await roadmap.save();
    res.json(roadmap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update node completion status' });
  }
};

exports.saveNodeNote = async (req, res) => {
  try {
    const { title, nodeId, noteText } = req.body;
    let roadmap = await Roadmap.findOne({ user: req.user.userId, title });

    if (!roadmap) {
      roadmap = new Roadmap({
        user: req.user.userId,
        title,
        completedNodes: [],
        notes: []
      });
    }

    const existingNote = roadmap.notes.find(n => n.nodeId === nodeId);
    if (existingNote) {
      existingNote.noteText = noteText;
      existingNote.updatedAt = new Date();
    } else {
      roadmap.notes.push({ nodeId, noteText });
    }

    await roadmap.save();
    res.json(roadmap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save node learning notes' });
  }
};

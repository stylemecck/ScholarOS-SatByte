const StudyPlan = require('../models/StudyPlan');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.aiGeneratePlan = async (req, res) => {
  try {
    const { goal, hoursPerDay } = req.body;
    
    const prompt = `As an expert academic counselor, create a detailed 7-day study plan for a student with the goal: "${goal}".
    The student can dedicate ${hoursPerDay} hours per day.
    Return the plan strictly as a JSON array of objects, where each object represents a task:
    {
      "subject": "String",
      "topic": "String",
      "duration": Number (minutes),
      "priority": "High" | "Medium" | "Low",
      "dayOffset": Number (0 to 6, where 0 is today)
    }
    Provide a balanced schedule with focus on foundational and advanced topics.
    Do not include any text, markdown, or backticks other than the JSON array.`;

    const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // CREDIT CHECK (Only if logged in)
    let user = null;
    if (req.user) {
      const User = require('../models/User'); // Import User model
      user = await User.findById(req.user.userId);
      if (user && user.credits < 1) {
        return res.status(403).json({ error: 'Insufficient credits', needsUpgrade: true });
      }
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let resultText = response.text();

    // DEDUCT CREDIT
    if (user) {
      user.credits -= 1;
      await user.save();
    }
    
    // Clean and parse
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    const generatedTasks = JSON.parse(resultText);

    // Map dayOffset to actual dates starting from today
    const tasksWithDates = generatedTasks.map(task => {
      const date = new Date();
      date.setDate(date.getDate() + task.dayOffset);
      return {
        ...task,
        date: date.toISOString().split('T')[0],
        completed: false
      };
    });

    res.json(tasksWithDates);
  } catch (err) {
    console.error("AI Plan Error:", err);
    res.status(500).json({ error: 'Failed to generate AI plan', details: err.message });
  }
};

exports.getStudyPlan = async (req, res) => {
  try {
    let plan = await StudyPlan.findOne({ user: req.user.userId });
    if (!plan) {
      plan = new StudyPlan({ user: req.user.userId, tasks: [] });
      await plan.save();
    }
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch study plan' });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { subject, topic, duration, priority, date } = req.body;
    let plan = await StudyPlan.findOne({ user: req.user.userId });
    
    if (!plan) {
      plan = new StudyPlan({ user: req.user.userId, tasks: [] });
    }

    plan.tasks.push({ subject, topic, duration, priority, date, completed: false });
    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const update = req.body;
    
    const plan = await StudyPlan.findOne({ user: req.user.userId });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const task = plan.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    Object.assign(task, update);
    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const plan = await StudyPlan.findOne({ user: req.user.userId });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    plan.tasks.pull(taskId);
    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

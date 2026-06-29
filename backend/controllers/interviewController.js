const Interview = require('../models/Interview');
const User = require('../models/User');
const { getAIModel, cleanAndParseJson } = require('../utils/aiHelper');

exports.startSession = async (req, res) => {
  try {
    const { category, difficulty } = req.body;
    if (!category) return res.status(400).json({ error: 'Interview category is required' });

    const user = await User.findById(req.user.userId);
    if (user && user.plan === 'Free') {
      // Check count of active or completed mock interviews today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const todayInterviews = await Interview.countDocuments({
        user: req.user.userId,
        createdAt: { $gte: startOfDay }
      });
      if (todayInterviews >= 2) {
        return res.status(403).json({
          error: 'Daily interview limit reached',
          message: 'Free tier users are limited to 2 mock interviews per day. Please upgrade to Pro/Ultimate for unlimited mocks.'
        });
      }
    }

    // Query Gemini to fetch 5 relevant mock interview questions
    const prompt = `You are a strict technical and behavioral recruiter interviewing a candidate for a role.
Category: ${category}
Difficulty: ${difficulty || 'Medium'}

Generate exactly 5 realistic, sequential interview questions for this setup.
Format the output as a strict JSON array of strings (no markdown blocks, no formatting words):
[
  "Question 1...",
  "Question 2..."
]`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const questionList = cleanAndParseJson(text);

    const questions = questionList.map(q => ({
      questionText: q,
      userAnswer: '',
      score: 0,
      feedback: ''
    }));

    const interview = new Interview({
      user: req.user.userId,
      category,
      difficulty: difficulty || 'Medium',
      status: 'active',
      questions,
      report: {
        communicationScore: 0,
        confidenceScore: 0,
        grammarScore: 0,
        technicalAccuracy: 0,
        speakingSpeed: 0,
        weakAreas: [],
        improvementTips: [],
        overallFeedback: 'Interview started.'
      }
    });

    await interview.save();
    res.status(201).json(interview);
  } catch (err) {
    console.error("Failed to start interview session:", err);
    res.status(500).json({ error: 'Failed to start interview session', details: err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, userAnswer } = req.body;
    if (questionIndex === undefined || userAnswer === undefined) {
      return res.status(400).json({ error: 'Question index and answer text are required' });
    }

    const interview = await Interview.findOne({ _id: interviewId, user: req.user.userId });
    if (!interview) return res.status(404).json({ error: 'Interview session not found' });
    if (interview.status !== 'active') return res.status(400).json({ error: 'Interview is already completed' });

    if (questionIndex < 0 || questionIndex >= interview.questions.length) {
      return res.status(400).json({ error: 'Invalid question index' });
    }

    const question = interview.questions[questionIndex];
    question.userAnswer = userAnswer;

    // Use Gemini to score the response
    const prompt = `Evaluate the candidate's answer to the given interview question.
Question: "${question.questionText}"
Candidate's Answer: "${userAnswer}"
Category: ${interview.category}
Difficulty: ${interview.difficulty}

Provide a score out of 100 representing correctness and professionalism, along with constructive, educational feedback.
Format the output as a strict JSON object:
{
  "score": 85,
  "feedback": "Your evaluation details here..."
}`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    let evaluation;
    try {
      evaluation = cleanAndParseJson(text);
    } catch (parseErr) {
      console.warn("Soft fallback for evaluation parsing error:", parseErr.message);
      const scoreMatch = text.match(/"score":\s*(\d+)/) || text.match(/score.*?(\d+)/i);
      const scoreVal = scoreMatch ? Math.min(100, parseInt(scoreMatch[1])) : 50;
      evaluation = {
        score: scoreVal,
        feedback: "Answer submission received. Feedback: " + text.replace(/[^a-zA-Z0-9\s.,'"]/g, '').substring(0, 300) + "..."
      };
    }

    question.score = evaluation.score || 50;
    question.feedback = evaluation.feedback || 'Answer recorded.';

    interview.markModified('questions');
    await interview.save();

    res.json({ question, interview });
  } catch (err) {
    console.error("Answer submission failure:", err);
    res.status(500).json({ error: 'Failed to evaluate answer', details: err.message });
  }
};

exports.compileCode = async (req, res) => {
  try {
    const { code, language, problemText } = req.body;
    if (!code) return res.status(400).json({ error: 'Code content cannot be empty' });

    // Use Gemini as an intelligent Compiler/Linter sandbox
    const prompt = `You are a code compilation and runtime analysis engine. 
Verify this candidate's code submission for syntax errors, logical bugs, and time/space complexity details.
Problem Statement Context:
${problemText || 'Write a program to reverse a linked list or perform sorting.'}

Submission:
Language: ${language || 'javascript'}
Code:
\`\`\`
${code}
\`\`\`

Provide compile status, syntax review, time/space complexity analysis, and simulation results against test cases.
Respond with a strict JSON format matching this layout (no code fences or introductory text):
{
  "status": "success/compile_error/failed_testcases",
  "compilerOutput": "Console logs, compilation messages or syntax errors here.",
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "testCasesPassed": 3,
  "testCasesTotal": 4,
  "feedback": "Identify logic flaws, syntax anomalies, and advice on code refinement."
}`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const compileResult = cleanAndParseJson(text);

    res.json(compileResult);
  } catch (err) {
    console.error("Compilation sandbox error:", err);
    res.status(500).json({ error: 'Simulated compiler engine failed', details: err.message });
  }
};

exports.finishSessionAndReport = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interview = await Interview.findOne({ _id: interviewId, user: req.user.userId });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const totalQuestions = interview.questions.length;
    let totalScore = 0;
    interview.questions.forEach(q => totalScore += q.score);
    const avgScore = totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 50;

    // Build overall feedback report with Gemini
    const prompt = `Generate a final performance analysis scorecard for this mock interview.
Category: ${interview.category}
Difficulty: ${interview.difficulty}
Average Score: ${avgScore}/100

Questions and Answers context:
${interview.questions.map((q, idx) => `Q${idx+1}: ${q.questionText}\nCandidate Answer: ${q.userAnswer}\nQuestion Score: ${q.score}/100`).join('\n\n')}

Provide detailed metrics (communication style score, confidence score, grammar score, technical accuracy score, simulated speaking speed (words-per-minute target), weak areas, tips, and overall remarks).
Response format must be a strict JSON object:
{
  "communicationScore": 80,
  "confidenceScore": 75,
  "grammarScore": 85,
  "technicalAccuracy": 78,
  "speakingSpeed": 130, // in words per minute
  "weakAreas": ["weakness 1", "weakness 2"],
  "improvementTips": ["tip 1", "tip 2"],
  "overallFeedback": "Provide detailed recap text about the candidate performance..."
}`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const finalReport = cleanAndParseJson(text);

    interview.report = finalReport;
    interview.status = 'completed';
    await interview.save();

    res.json(interview);
  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ error: 'Failed to compile interview report', details: err.message });
  }
};

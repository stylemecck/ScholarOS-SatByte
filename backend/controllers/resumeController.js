const Resume = require('../models/Resume');
const User = require('../models/User');
const { getAIModel, cleanAndParseJson } = require('../utils/aiHelper');

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.userId }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

exports.saveResume = async (req, res) => {
  try {
    const { 
      resumeId, title, personalInfo, summary, education, experience, 
      projects, certifications, achievements, skills, languages, 
      interests, template, themeColor, fontFamily, spacing, fontSize 
    } = req.body;

    // Simple client-side equivalent score calculation
    let score = 20;
    if (personalInfo?.fullName) score += 10;
    if (personalInfo?.title) score += 5;
    if (summary && summary.length > 50) score += 10;
    if (experience?.length > 0) score += 15;
    if (education?.length > 0) score += 10;
    if (projects?.length > 0) score += 10;
    if (skills?.length >= 5) score += 10;
    if (certifications?.length > 0) score += 5;
    if (languages?.length > 0) score += 5;
    if (interests?.length > 0) score += 5;
    score = Math.min(score, 100);

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let resume;
    if (resumeId) {
      resume = await Resume.findOneAndUpdate(
        { _id: resumeId, user: req.user.userId },
        { 
          title, personalInfo, summary, education, experience, 
          projects, certifications, achievements, skills, languages, 
          interests, template, themeColor, fontFamily, spacing, fontSize, atsScore: score 
        },
        { new: true }
      );
    }

    if (!resume) {
      // Validate resume limit per plan
      const resumeCount = await Resume.countDocuments({ user: req.user.userId });
      const userPlan = user.plan || 'Free';
      let draftLimit = 1; // Free
      if (userPlan === 'Pro') draftLimit = 5;
      else if (userPlan === 'Ultimate' || userPlan === 'Enterprise') draftLimit = 50;

      if (resumeCount >= draftLimit) {
        return res.status(403).json({ 
          error: `You have reached the limit of ${draftLimit} resume draft(s) for your ${userPlan} plan. Please delete existing drafts or upgrade your plan to create more.` 
        });
      }

      resume = new Resume({
        user: req.user.userId,
        title: title || 'My Resume',
        personalInfo, summary, education, experience, 
        projects, certifications, achievements, skills, languages, 
        interests, template, themeColor, fontFamily, spacing, fontSize, atsScore: score
      });
      await resume.save();
    }

    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save resume details' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};

exports.analyzeResumeATS = async (req, res) => {
  try {
    const { resumeData, targetRole } = req.body;
    if (!resumeData) return res.status(400).json({ error: 'Resume details missing' });

    const user = await User.findById(req.user.userId);
    if (user && user.credits < 2) {
      return res.status(403).json({ error: 'Insufficient credits. Requires 2 credits.', needsUpgrade: true });
    }

    const prompt = `You are a Senior Technical Recruiter, ATS (Applicant Tracking System) Specialist, and Career Optimization Expert. 
Analyze the candidate's resume details for a target job role: "${targetRole || 'Software Developer'}".

RESUME DATA:
- Title/Profile: ${resumeData.personalInfo?.title || 'N/A'}
- Professional Summary: ${resumeData.summary || 'N/A'}
- Experience: ${JSON.stringify(resumeData.experience || [])}
- Education: ${JSON.stringify(resumeData.education || [])}
- Projects: ${JSON.stringify(resumeData.projects || [])}
- Skills: ${JSON.stringify(resumeData.skills || [])}

Perform a rigorous recruiter audit:
1. **ATS Score (0-100)**: Calculate a realistic score based on: keyword density matching, presence of weak/passive phrases (e.g., "assisted with", "responsible for"), completeness of sections, and metric quantification (percentage of bullet points containing numbers/metrics).
2. **Missing Keywords**: Extract key technical terms, methodologies, or certifications that recruiters expect for this role but are absent.
3. **Skill Suggestions**: Recommend specific high-value skills to add to close the gap.
4. **Project Improvements**: Detail action items to make the projects sound enterprise-grade (e.g., specifying architecture, performance scales, or deployment frameworks).
5. **Formatting & Verbiage Feedback**: Critique the verbiage. Recommend active verbs (e.g. "orchestrated", "engineered") and point out generic descriptions.

Provide your analysis in JSON format exactly as follows:
{
  "score": 75,
  "compatibility": "High/Moderate/Low",
  "missingKeywords": ["keyword1", "keyword2"],
  "skillSuggestions": ["skill1", "skill2"],
  "projectImprovements": ["e.g., Specify database size and query optimizations under Project Alpha.", "e.g., Quantify time savings or performance scale of the dashboard backend."],
  "formatFeedback": "Critique on verbiage active-verb density, metric quantification levels, and brevity guidelines."
}`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const analytics = cleanAndParseJson(text);

    if (user) {
      user.credits -= 2;
      user.creditHistory.push({
        type: 'spent',
        amount: 2,
        description: `ATS Analytics for role: ${targetRole || 'General'}`
      });
      await user.save();
    }

    res.json(analytics);
  } catch (err) {
    console.error("ATS Checker error:", err);
    res.status(500).json({ error: 'ATS audit failed', details: err.message });
  }
};

exports.generateCoverLetter = async (req, res) => {
  try {
    const { resumeData, jobTitle, companyName, jobDescription } = req.body;
    const user = await User.findById(req.user.userId);
    if (user && user.credits < 3) {
      return res.status(403).json({ error: 'Insufficient credits. Requires 3 credits.', needsUpgrade: true });
    }

    const prompt = `Write a polished, highly persuasive professional cover letter for the role: "${jobTitle}" at "${companyName || 'Target Company'}".
JOB DESCRIPTION CONTEXT:
${jobDescription || 'N/A'}

CANDIDATE INFO:
- Name: ${resumeData.personalInfo?.fullName || 'Candidate'}
- Title: ${resumeData.personalInfo?.title || 'N/A'}
- Key Skills: ${resumeData.skills?.join(', ') || 'N/A'}
- Experience Context: ${JSON.stringify(resumeData.experience || [])}

Create a standard letter structure with placeholder contact info lines at the top. Keep it to 3-4 highly impact-focused paragraphs. Respond strictly with the cover letter text, no conversational introductions.`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    const coverLetter = (await result.response).text().trim();

    if (user) {
      user.credits -= 3;
      user.creditHistory.push({
        type: 'spent',
        amount: 3,
        description: `Generated AI Cover Letter for ${jobTitle}`
      });
      await user.save();
    }

    res.json({ coverLetter });
  } catch (err) {
    console.error("AI Cover Letter error:", err);
    res.status(500).json({ error: 'Cover letter generation failed' });
  }
};

exports.careerAdvisor = async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) return res.status(400).json({ error: 'Resume details missing' });

    const user = await User.findById(req.user.userId);
    if (user && user.credits < 5) {
      return res.status(403).json({ error: 'Insufficient credits. Requires 5 credits.', needsUpgrade: true });
    }

    const prompt = `You are an expert AI Career Coach and mentor. Analyze the candidate's profile:
RESUME DATA:
- Title/Profile: ${resumeData.personalInfo?.title || 'N/A'}
- Experience: ${JSON.stringify(resumeData.experience || [])}
- Education: ${JSON.stringify(resumeData.education || [])}
- Projects: ${JSON.stringify(resumeData.projects || [])}
- Skills: ${JSON.stringify(resumeData.skills || [])}

Recommend:
1. Career Paths (roles, demand level, salary range estimate)
2. Recommended certifications to acquire next
3. Target learning roadmap milestones (3 milestones)
4. Suitable internship role suggestions (with company types)
5. Salary ranges for entry and mid-level roles (in USD and INR)

Provide response in JSON format exactly as follows:
{
  "careerPaths": [{"role": "Role Name", "demand": "High/Med/Low", "salaryEstimate": "range"}],
  "recommendedCertifications": ["Cert 1", "Cert 2"],
  "learningRoadmap": ["Phase 1: ...", "Phase 2: ..."],
  "internshipSuggestions": ["Role - Company (e.g. Frontend Intern at startup)"],
  "salaryEstimate": { "entry": "range", "mid": "range" }
}`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const analysis = cleanAndParseJson(text);

    if (user) {
      user.credits -= 5;
      user.creditHistory.push({
        type: 'spent',
        amount: 5,
        description: 'AI Career Consultation Advisor'
      });
      await user.save();
    }

    // Automatically save as a document record in user docs
    try {
      const Document = require('../models/Document');
      const docName = `${resumeData.personalInfo?.fullName || 'Candidate'}_Career_Advisor_Audit.txt`;
      
      const txtContent = `SCHOLAROS AI CAREER ADVISOR REPORT
Candidate: ${resumeData.personalInfo?.fullName || 'N/A'}
Target Focus: ${resumeData.personalInfo?.title || 'N/A'}
Date Compiled: ${new Date().toLocaleDateString()}

=========================================
1. RECOMMENDED CAREER PATHS
=========================================
${analysis.careerPaths?.map((cp, idx) => `${idx + 1}. Role: ${cp.role}
   - Demand Level: ${cp.demand}
   - Estimated Salary: ${cp.salaryEstimate || 'N/A'}`).join('\n\n')}

=========================================
2. TARGET LEARNING ROADMAP TIMELINE
=========================================
${analysis.learningRoadmap?.map((milestone, idx) => `Phase ${idx + 1}: ${milestone}`).join('\n\n')}

=========================================
3. REQUISITE CERTIFICATIONS
=========================================
${analysis.recommendedCertifications?.map((c, idx) => `- ${c}`).join('\n')}

=========================================
4. TARGET INTERNSHIPS & ROLES
=========================================
${analysis.internshipSuggestions?.map((i, idx) => `- ${i}`).join('\n')}

=========================================
5. SALARY SPECTRUM
=========================================
- Entry-Level Roles: ${analysis.salaryEstimate?.entry || 'N/A'}
- Mid-Level Roles: ${analysis.salaryEstimate?.mid || 'N/A'}
`;

      const newDoc = new Document({
        user: req.user.userId,
        fileName: docName.replace(/\s+/g, '_'),
        fileType: 'txt',
        fileSize: Buffer.byteLength(txtContent, 'utf8'),
        textContent: txtContent,
        readingProgress: 100
      });
      await newDoc.save();
    } catch (docErr) {
      console.warn("Failed to automatically archive advisor report as document:", docErr.message);
    }

    res.json(analysis);
  } catch (err) {
    console.error("AI Career Advisor error:", err);
    res.status(500).json({ error: 'Career advice generation failed', details: err.message });
  }
};

exports.tailorResume = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) return res.status(400).json({ error: 'Missing resume data or job description' });

    const user = await User.findById(req.user.userId);
    if (user && user.credits < 4) {
      return res.status(403).json({ error: 'Insufficient credits. Requires 4 credits.', needsUpgrade: true });
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) Integration Specialist and Technical Writer. 
Compare the candidate's resume details:
RESUME: ${JSON.stringify(resumeData)}

Against the target Job Description:
JD: ${jobDescription}

Perform a high-level optimization:
1. **Keyword Extraction**: Identify core technical skills, frameworks, concepts, and certifications required in the JD.
2. **Analysis**: Check which key terms are present and which are missing from the resume.
3. **Realistic Score Calculation**: Calculate an ATS compatibility match percentage based on semantic similarity and hard requirements.
4. **Summary Optimization**: Auto-rewrite the Professional Summary to be a compelling, high-impact overview (under 75 words) that features key JD terms.
5. **Bullet Point Rewriting**: Suggest rewrites for the candidate's existing experience or project bullet points. 
   - Each rewrite MUST strictly follow the **STAR format** (Situation, Task, Action, Result) or **Google's XYZ formula** (Accomplished [X] as measured by [Y], by doing [Z]).
   - Every suggestion must start with a powerful active verb (e.g., "engineered", "pioneered", "implemented").
   - **CRITICAL**: Do NOT fabricate fake jobs, fake metrics, or fake companies. Maintain alignment with the candidate's actual history.

Provide response in JSON format exactly as follows:
{
  "matchPercentage": 65,
  "missingKeywords": ["keyword1", "keyword2"],
  "matchingKeywords": ["match1", "match2"],
  "suggestedSummary": "Optimized professional summary here...",
  "suggestedBulletRewrites": [{"original": "original text", "suggested": "optimized bullet in STAR or Google XYZ format starting with a strong active verb"}]
}`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const tailored = cleanAndParseJson(text);

    if (user) {
      user.credits -= 4;
      user.creditHistory.push({
        type: 'spent',
        amount: 4,
        description: 'AI Resume Tailoring Optimization'
      });
      await user.save();
    }

    res.json(tailored);
  } catch (err) {
    console.error("AI Tailor error:", err);
    res.status(500).json({ error: 'Tailoring analysis failed', details: err.message });
  }
};

exports.interviewPrep = async (req, res) => {
  try {
    const { resumeData, targetRole } = req.body;
    if (!resumeData) return res.status(400).json({ error: 'Resume data is missing' });

    const user = await User.findById(req.user.userId);
    if (user && user.credits < 3) {
      return res.status(403).json({ error: 'Insufficient credits. Requires 3 credits.', needsUpgrade: true });
    }

    const prompt = `Generate interview preparation questions based on this resume and target role: "${targetRole || 'Software Engineer'}".
Resume: ${JSON.stringify(resumeData)}

Provide 5 questions (1 HR/general, 2 Technical, 2 Behavioral/Resume-based).
Include expected guidelines/tips for answering each.

Format as JSON exactly as follows:
{
  "questions": [
    {
      "id": "q1",
      "type": "HR/Technical/Behavioral",
      "question": "The question content here?",
      "guidelines": "Tips on what key things the interviewer is looking for."
    }
  ]
}`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const questions = cleanAndParseJson(text);

    if (user) {
      user.credits -= 3;
      user.creditHistory.push({
        type: 'spent',
        amount: 3,
        description: `AI Interview Prep Questions for: ${targetRole}`
      });
      await user.save();
    }

    res.json(questions);
  } catch (err) {
    console.error("Interview prep error:", err);
    res.status(500).json({ error: 'Interview prep generation failed', details: err.message });
  }
};

exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, expectedGuidelines, userAnswer } = req.body;
    if (!question || !userAnswer) return res.status(400).json({ error: 'Missing question or answer data' });

    const prompt = `Evaluate the candidate's answer to the interview question:
Question: "${question}"
Expected Key Points: "${expectedGuidelines || 'N/A'}"
Candidate Answer: "${userAnswer}"

Provide constructive feedback, a score out of 10, and a suggested model answer.

Format as JSON exactly as follows:
{
  "score": 8, // out of 10
  "feedback": "Your answer covered X well, but could improve Y by mentioning Z.",
  "modelAnswer": "A professional example response..."
}`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const evaluation = cleanAndParseJson(text);
    res.json(evaluation);
  } catch (err) {
    console.error("Evaluate answer error:", err);
    res.status(500).json({ error: 'Answer evaluation failed', details: err.message });
  }
};

exports.generateProject = async (req, res) => {
  try {
    const { projectName, technologies } = req.body;
    if (!projectName) return res.status(400).json({ error: 'Project name is missing' });

    const prompt = `Generate details for a new professional portfolio project:
Project Name: "${projectName}"
Technologies: "${technologies || 'React, Node.js'}"

Provide:
1. Description
2. Core Features (array)
3. Challenges & Key Learnings (array)
4. Resume Bullet Points (STAR format, array)
5. A short README.md template content

Format as JSON exactly as follows:
{
  "description": "Project overview...",
  "features": ["feature 1", "feature 2"],
  "challenges": ["challenge 1", "challenge 2"],
  "resumeBullets": ["Developed X using Y which achieved Z...", "Built A to optimize B..."],
  "readme": "# Project Name\\n\\n## Tech Stack\\n... etc"
}`;

    const model = getAIModel("gemini-1.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const projectData = cleanAndParseJson(text);
    res.json(projectData);
  } catch (err) {
    console.error("Project generator error:", err);
    res.status(500).json({ error: 'Project details generation failed', details: err.message });
  }
};

exports.aiFillResume = async (req, res) => {
  try {
    const { title, skills } = req.body;
    if (!title) return res.status(400).json({ error: 'Target job title is required for AI auto-fill' });

    const user = await User.findById(req.user.userId);
    if (user && user.credits < 5) {
      return res.status(403).json({ error: 'Insufficient credits. Requires 5 credits.', needsUpgrade: true });
    }

    const prompt = `You are a Senior Technical Resume Writer, Executive Career Coach, and Recruiter.
Generate a complete, outstanding, ready-to-use candidate resume profile for:
Target Role: "${title}"
Primary Skills Context: "${skills || 'None specified'}"

Ensure all generated details are highly realistic and tailored to the target role.
- Work experiences and projects MUST use the STAR format or Google XYZ formula.
- Start all description bullet points with powerful active verbs.
- Quantify achievements with metrics (e.g. "improved speed by 35%", "shrunk database load by 40%").

Provide the output strictly as a JSON object matching this schema:
{
  "personalInfo": {
    "fullName": "Name of candidate",
    "email": "candidate@example.com",
    "phone": "+91 98765 43210",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/profile",
    "portfolio": "profile.dev",
    "github": "github.com/profile",
    "title": "Professional Title matching the target role"
  },
  "summary": "High-impact summary aligning skills with the target role...",
  "education": [
    {
      "id": "edu_1",
      "institution": "Prestigious Technical University Name",
      "degree": "Degree (e.g., Bachelor of Technology in Computer Science)",
      "startDate": "2020",
      "endDate": "2024",
      "location": "City"
    }
  ],
  "experience": [
    {
      "id": "exp_1",
      "company": "Top Tier Tech Corporation",
      "position": "Job Title matching target role",
      "startDate": "June 2024",
      "endDate": "Present",
      "description": "Developed and engineered scalable solutions using key technologies. Optimized request handling latency by 35% and collaborated with product teams to design and deploy 4 core microservices."
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "name": "Enterprise Technical Project Name",
      "link": "github.com/profile/project-name",
      "description": "A high-performance system leveraging modern tools to solve a specific industry problem. Features auto-scaling backend components, secure integrations, and a responsive frontend UI."
    }
  ],
  "certifications": [
    {
      "id": "cert_1",
      "name": "AWS Certified Developer or similar high-value certification",
      "issuer": "Amazon Web Services",
      "date": "2024"
    }
  ],
  "achievements": [
    {
      "id": "ach_1",
      "description": "Winner of National level hackathon or key hackathon project."
    }
  ],
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6", "Skill7", "Skill8"]
}`;

    const model = getAIModel("gemini-2.5-flash");
    const result = await model.generateContent(prompt);
    let text = (await result.response).text();

    const resumeData = cleanAndParseJson(text);

    if (user) {
      user.credits -= 5;
      user.creditHistory.push({
        type: 'spent',
        amount: 5,
        description: `AI Resume Auto-Fill for: ${title}`
      });
      await user.save();
    }

    res.json(resumeData);
  } catch (err) {
    console.error("AI Auto-fill error:", err);
    res.status(500).json({ error: 'AI Resume generation failed', details: err.message });
  }
};

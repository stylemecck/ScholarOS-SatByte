const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', resumeController.getResumes);
router.post('/save', resumeController.saveResume);
router.delete('/:id', resumeController.deleteResume);
router.post('/analyze', resumeController.analyzeResumeATS);
router.post('/ai-cover-letter', resumeController.generateCoverLetter);
router.post('/career-advisor', resumeController.careerAdvisor);
router.post('/tailor', resumeController.tailorResume);
router.post('/interview-prep', resumeController.interviewPrep);
router.post('/evaluate-answer', resumeController.evaluateAnswer);
router.post('/project-generator', resumeController.generateProject);
router.post('/ai-fill', resumeController.aiFillResume);

module.exports = router;

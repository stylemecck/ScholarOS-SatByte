const express = require('express');
const router = express.Router();
const studyPlannerController = require('../controllers/studyPlannerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, studyPlannerController.getStudyPlan);
router.post('/ai-generate', authMiddleware, studyPlannerController.aiGeneratePlan);
router.post('/tasks', authMiddleware, studyPlannerController.addTask);
router.put('/tasks/:taskId', authMiddleware, studyPlannerController.updateTask);
router.delete('/tasks/:taskId', authMiddleware, studyPlannerController.deleteTask);

module.exports = router;

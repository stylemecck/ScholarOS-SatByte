const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', roadmapController.getRoadmaps);
router.post('/suggest', roadmapController.suggestRoadmap);
router.post('/toggle-node', roadmapController.toggleNode);
router.post('/note', roadmapController.saveNodeNote);

module.exports = router;

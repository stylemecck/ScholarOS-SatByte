const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // Protect all chat routes

router.get('/', chatController.getChats);
router.post('/', chatController.createChat);
router.get('/:id', chatController.getChatById);
router.post('/:id/messages', chatController.addMessage);
router.put('/:id/rename', chatController.renameChat);
router.put('/:id/folder', chatController.organizeFolder);
router.delete('/:id', chatController.deleteChat);

module.exports = router;

const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect, admin } = require('../middlewares/authMiddleware');

// Get all settings (Public - or specific ones)
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.key] = s.value);
    res.json(settingsMap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update or create setting (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { key, value } = req.body;
  try {
    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      setting.updatedAt = Date.now();
      await setting.save();
    } else {
      setting = await Setting.create({ key, value });
    }
    res.json(setting);
  } catch (err) {
    console.error("SETTING UPDATE ERROR:", err);
    res.status(500).json({ error: `Failed to update setting: ${err.message}` });
  }
});

module.exports = router;

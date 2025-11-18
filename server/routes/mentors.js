const express = require('express');
const MentorProfile = require('../models/MentorProfile');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create or update the current mentor's profile
router.post('/me', authRequired, requireRole('mentor'), async (req, res) => {
  try {
    const { bio, expertise, timezone, isActive } = req.body;

    const update = { bio, timezone };
    if (expertise !== undefined) update.expertise = expertise;
    if (isActive !== undefined) update.isActive = isActive;

    const profile = await MentorProfile.findOneAndUpdate(
      { user: req.user._id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ profile });
  } catch (err) {
    console.error('Error updating mentor profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List active mentors and their profiles
router.get('/', authRequired, async (req, res) => {
  try {
    const mentors = await MentorProfile.find({ isActive: true }).populate('user');
    res.json({ mentors });
  } catch (err) {
    console.error('Error fetching mentors:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

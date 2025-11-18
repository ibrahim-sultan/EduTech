const express = require('express');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Upsert progress for a lesson for the current user
router.post('/', authRequired, async (req, res) => {
  try {
    const { lessonId, status } = req.body;

    if (!lessonId || !status) {
      return res.status(400).json({ error: 'lessonId and status are required' });
    }

    if (!['not_started', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, lesson: lessonId },
      { status },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ progress });
  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all progress records for the current user (optionally filtered by lessonIds)
router.get('/me', authRequired, async (req, res) => {
  try {
    const { lessonIds } = req.query;
    const filter = { user: req.user._id };

    if (lessonIds) {
      const ids = Array.isArray(lessonIds) ? lessonIds : String(lessonIds).split(',');
      filter.lesson = { $in: ids };
    }

    const progress = await Progress.find(filter).populate('lesson');

    res.json({ progress });
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

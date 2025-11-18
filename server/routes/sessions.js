const express = require('express');
const Session = require('../models/Session');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Student books a session with a mentor
router.post('/', authRequired, async (req, res) => {
  try {
    const { mentorId, scheduledAt, durationMinutes, notes } = req.body;

    if (!mentorId || !scheduledAt) {
      return res.status(400).json({ error: 'mentorId and scheduledAt are required' });
    }

    const session = await Session.create({
      mentor: mentorId,
      student: req.user._id,
      scheduledAt,
      durationMinutes,
      notes,
    });

    res.status(201).json({ session });
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sessions for current student
router.get('/me', authRequired, async (req, res) => {
  try {
    const sessions = await Session.find({ student: req.user._id })
      .sort({ scheduledAt: -1 })
      .populate('mentor');

    res.json({ sessions });
  } catch (err) {
    console.error('Error fetching student sessions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sessions for current mentor
router.get('/mentor', authRequired, requireRole('mentor'), async (req, res) => {
  try {
    const sessions = await Session.find({ mentor: req.user._id })
      .sort({ scheduledAt: -1 })
      .populate('student');

    res.json({ sessions });
  } catch (err) {
    console.error('Error fetching mentor sessions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update session status (mentor/admin)
router.put('/:id', authRequired, requireRole('mentor'), async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (status && !['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const update = {};
    if (status !== undefined) update.status = status;
    if (notes !== undefined) update.notes = notes;

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, mentor: req.user._id },
      update,
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (err) {
    console.error('Error updating session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

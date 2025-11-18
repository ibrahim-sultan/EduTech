const express = require('express');
const Enrollment = require('../models/Enrollment');
const Track = require('../models/Track');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Enroll the current user in a track
router.post('/', authRequired, async (req, res) => {
  try {
    const { trackId } = req.body;

    if (!trackId) {
      return res.status(400).json({ error: 'trackId is required' });
    }

    const track = await Track.findById(trackId);
    if (!track || !track.isActive) {
      return res.status(404).json({ error: 'Track not found' });
    }

    try {
      const enrollment = await Enrollment.create({
        user: req.user._id,
        track: trackId,
      });

      res.status(201).json({ enrollment });
    } catch (err) {
      // Handle duplicate enrollment gracefully
      if (err.code === 11000) {
        const existing = await Enrollment.findOne({
          user: req.user._id,
          track: trackId,
        });
        return res.status(200).json({ enrollment: existing, alreadyEnrolled: true });
      }
      throw err;
    }
  } catch (err) {
    console.error('Error creating enrollment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all enrollments for the current user
router.get('/me', authRequired, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('track');

    res.json({ enrollments });
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

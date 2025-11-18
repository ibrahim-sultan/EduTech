const express = require('express');
const Module = require('../models/Module');
const Track = require('../models/Track');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create a new module under a track (admin only)
router.post('/', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const { trackId, title, description, order } = req.body;

    if (!trackId || !title) {
      return res.status(400).json({ error: 'trackId and title are required' });
    }

    const track = await Track.findById(trackId);
    if (!track || !track.isActive) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const moduleDoc = await Module.create({
      track: trackId,
      title,
      description,
      order: typeof order === 'number' ? order : 0,
    });

    // Append module to track.modules array
    track.modules.push(moduleDoc._id);
    await track.save();

    res.status(201).json({ module: moduleDoc });
  } catch (err) {
    console.error('Error creating module:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

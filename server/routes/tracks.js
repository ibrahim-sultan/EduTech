const express = require('express');
const Track = require('../models/Track');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create a new track (admin only)
router.post('/', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const { title, slug, description, level, isActive } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'title and slug are required' });
    }

    const track = await Track.create({
      title,
      slug,
      description,
      level,
      isActive,
    });

    res.status(201).json({ track });
  } catch (err) {
    console.error('Error creating track:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Slug already in use' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing track (admin only)
router.put('/:id', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const { title, slug, description, level, isActive } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (slug !== undefined) update.slug = slug;
    if (description !== undefined) update.description = description;
    if (level !== undefined) update.level = level;
    if (isActive !== undefined) update.isActive = isActive;

    const track = await Track.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json({ track });
  } catch (err) {
    console.error('Error updating track:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Slug already in use' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List all active tracks with nested modules and lessons
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate({
        path: 'modules',
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
        },
      });

    res.json({ tracks });
  } catch (err) {
    console.error('Error fetching tracks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single track by id with nested modules and lessons
router.get('/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id).populate({
      path: 'modules',
      options: { sort: { order: 1 } },
      populate: {
        path: 'lessons',
        options: { sort: { order: 1 } },
      },
    });

    if (!track || !track.isActive) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json({ track });
  } catch (err) {
    console.error('Error fetching track:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

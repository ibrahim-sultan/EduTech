const express = require('express');
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create a new lesson under a module (admin only)
router.post('/', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const { moduleId, title, description, slug, type, order } = req.body;

    if (!moduleId || !title) {
      return res.status(400).json({ error: 'moduleId and title are required' });
    }

    const moduleDoc = await Module.findById(moduleId);
    if (!moduleDoc) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const lesson = await Lesson.create({
      module: moduleId,
      title,
      description,
      slug,
      type,
      order: typeof order === 'number' ? order : 0,
    });

    // Append lesson to module.lessons array
    moduleDoc.lessons.push(lesson._id);
    await moduleDoc.save();

    res.status(201).json({ lesson });
  } catch (err) {
    console.error('Error creating lesson:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

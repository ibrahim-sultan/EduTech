const express = require('express');
const Assignment = require('../models/Assignment');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create assignment (admin only)
router.post('/', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const { moduleId, title, description, instructions, maxScore, dueDate } = req.body;

    if (!moduleId || !title) {
      return res.status(400).json({ error: 'moduleId and title are required' });
    }

    const assignment = await Assignment.create({
      module: moduleId,
      title,
      description,
      instructions,
      maxScore,
      dueDate,
    });

    res.status(201).json({ assignment });
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List assignments for a module (auth required)
router.get('/', authRequired, async (req, res) => {
  try {
    const { moduleId } = req.query;
    const filter = { isActive: true };

    if (moduleId) {
      filter.module = moduleId;
    }

    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    res.json({ assignments });
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update assignment (admin only)
router.put('/:id', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const { title, description, instructions, maxScore, dueDate, isActive } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (instructions !== undefined) update.instructions = instructions;
    if (maxScore !== undefined) update.maxScore = maxScore;
    if (dueDate !== undefined) update.dueDate = dueDate;
    if (isActive !== undefined) update.isActive = isActive;

    const assignment = await Assignment.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({ assignment });
  } catch (err) {
    console.error('Error updating assignment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

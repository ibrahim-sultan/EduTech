const express = require('express');
const Course = require('../models/Course');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ course });
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new course (admin only)
router.post('/', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const { title, description, level, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const course = new Course({ title, description, level, category });
    await course.save();

    res.status(201).json({ course });
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update course (admin only)
router.put('/:id', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const { title, description, level, category } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, level, category },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete course (admin only)
router.delete('/:id', authRequired, requireRole('admin'), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

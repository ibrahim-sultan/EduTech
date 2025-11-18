const express = require('express');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create or update a submission for an assignment (student)
router.post('/', authRequired, async (req, res) => {
  try {
    const { assignmentId, repoUrl, demoUrl, notes } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ error: 'assignmentId is required' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || !assignment.isActive) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const submission = await Submission.findOneAndUpdate(
      { assignment: assignmentId, student: req.user._id },
      {
        repoUrl,
        demoUrl,
        notes,
        status: 'submitted',
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ submission });
  } catch (err) {
    console.error('Error creating submission:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user's submissions
router.get('/me', authRequired, async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assignment');

    res.json({ submissions });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List submissions for mentors/admins (optionally filter by assignment)
router.get('/', authRequired, requireRole('mentor'), async (req, res) => {
  try {
    const { assignmentId } = req.query;
    const filter = {};
    if (assignmentId) {
      filter.assignment = assignmentId;
    }

    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .populate('assignment')
      .populate('student');

    res.json({ submissions });
  } catch (err) {
    console.error('Error fetching submissions for review:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Review a submission (mentor/admin)
router.post('/:id/review', authRequired, requireRole('mentor'), async (req, res) => {
  try {
    const { status, score, feedback } = req.body;

    if (status && !['in_review', 'changes_requested', 'approved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value for review' });
    }

    const update = { reviewer: req.user._id };
    if (status !== undefined) update.status = status;
    if (score !== undefined) update.score = score;
    if (feedback !== undefined) update.feedback = feedback;

    const submission = await Submission.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ submission });
  } catch (err) {
    console.error('Error reviewing submission:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

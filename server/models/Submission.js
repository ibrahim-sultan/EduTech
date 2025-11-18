const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    repoUrl: { type: String },
    demoUrl: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['submitted', 'in_review', 'changes_requested', 'approved'],
      default: 'submitted',
    },
    score: { type: Number },
    feedback: { type: String },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;

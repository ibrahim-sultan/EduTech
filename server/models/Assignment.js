const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true },
    description: { type: String },
    instructions: { type: String },
    maxScore: { type: Number, default: 100 },
    dueDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;

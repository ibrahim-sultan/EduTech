const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    track: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    // Ordered list of lessons in this module
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  },
  { timestamps: true }
);

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;

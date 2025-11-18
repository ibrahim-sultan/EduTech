const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    isActive: { type: Boolean, default: true },
    // Ordered list of modules belonging to this track
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  },
  { timestamps: true }
);

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;

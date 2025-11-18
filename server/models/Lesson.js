const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true },
    slug: { type: String, lowercase: true, trim: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ['reading', 'video', 'quiz', 'project'],
      default: 'reading',
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;

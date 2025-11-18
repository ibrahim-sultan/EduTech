const mongoose = require('mongoose');

const mentorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String },
    expertise: [{ type: String }],
    timezone: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);

module.exports = MentorProfile;

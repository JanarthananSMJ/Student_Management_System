const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      required: true,
    },
    credits: { type: Number, default: 0, set: (v) => (v === '' ? undefined : v) },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', set: (v) => (v === '' ? undefined : v) },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Subject', subjectSchema);

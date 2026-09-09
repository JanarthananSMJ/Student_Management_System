const mongoose = require('mongoose');

const classSectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    section: { type: String, required: true, default: 'A' },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', set: (v) => (v === '' ? undefined : v) },
    capacity: { type: Number, set: (v) => (v === '' ? undefined : v) },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ClassSection', classSectionSchema);

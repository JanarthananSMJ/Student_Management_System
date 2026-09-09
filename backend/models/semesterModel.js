const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    startDate: { type: Date, set: (v) => (v === '' ? undefined : v) },
    endDate: { type: Date, set: (v) => (v === '' ? undefined : v) },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Semester', semesterSchema);

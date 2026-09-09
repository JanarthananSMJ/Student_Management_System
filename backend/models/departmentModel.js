const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    hod: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', set: (v) => (v === '' ? undefined : v) },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Department', departmentSchema);

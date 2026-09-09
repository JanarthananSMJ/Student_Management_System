const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false },
);

const studentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: { type: String, required: true, unique: true },
    personalDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String },
      dob: { type: Date, set: (v) => (v === '' ? undefined : v) },
      gender: { type: String, enum: ['male', 'female', 'other'], set: (v) => (v === '' ? undefined : v) },
      bloodGroup: { type: String },
      photo: { type: String },
    },
    contact: {
      email: String,
      phone: String,
      address: addressSchema,
    },
    guardian: {
      name: String,
      relation: String,
      phone: String,
      email: String,
      occupation: String,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    classSection: { type: Schema.Types.ObjectId, ref: 'ClassSection', set: (v) => (v === '' ? undefined : v) },
    admission: {
      admissionNumber: { type: String, unique: true, sparse: true, set: (v) => (v === '' ? undefined : v) },
      admissionDate: { type: Date, set: (v) => (v === '' ? undefined : v) },
      academicYear: { type: Schema.Types.ObjectId, ref: 'AcademicYear', set: (v) => (v === '' ? undefined : v) },
    },
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'suspended'],
      default: 'active',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Student', studentSchema);

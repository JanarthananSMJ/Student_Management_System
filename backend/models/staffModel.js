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

const staffSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    staffId: { type: String, required: true, unique: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    designation: { type: String, required: true },
    subjectsHandled: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    classesAssigned: [{ type: Schema.Types.ObjectId, ref: 'ClassSection' }],
    phone: { type: String },
    address: addressSchema,
    joiningDate: { type: Date, set: (v) => (v === '' ? undefined : v) },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Staff', staffSchema);

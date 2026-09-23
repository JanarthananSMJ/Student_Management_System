require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Department = require('../models/departmentModel');

const DEFAULT_DEPARTMENTS = [
  { name: 'Computer Science and Engineering', code: 'CSE' },
  { name: 'Information Technology', code: 'IT' },
  { name: 'Electronics and Communication Engineering', code: 'ECE' },
  { name: 'Electrical and Electronics Engineering', code: 'EEE' },
  { name: 'Mechanical Engineering', code: 'MECH' },
  { name: 'Civil Engineering', code: 'CIVIL' },
];

const run = async () => {
  await connectDB();

  for (const dept of DEFAULT_DEPARTMENTS) {
    const existing = await Department.findOne({ code: dept.code });
    if (existing) {
      console.log(`Department already exists: ${dept.code}. Skipping.`);
      continue;
    }
    await Department.create(dept);
    console.log(`Department created: ${dept.code} - ${dept.name}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to seed departments:', err);
  process.exit(1);
});

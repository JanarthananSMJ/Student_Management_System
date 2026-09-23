require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Department = require('../models/departmentModel');
const Course = require('../models/courseModel');

const DEFAULT_COURSES = [
  { name: 'B.Tech Computer Science and Engineering', code: 'CSE-BTECH', departmentCode: 'CSE', durationSemesters: 8 },
  { name: 'B.Tech Information Technology', code: 'IT-BTECH', departmentCode: 'IT', durationSemesters: 8 },
  { name: 'B.Tech Electronics and Communication Engineering', code: 'ECE-BTECH', departmentCode: 'ECE', durationSemesters: 8 },
  { name: 'B.Tech Electrical and Electronics Engineering', code: 'EEE-BTECH', departmentCode: 'EEE', durationSemesters: 8 },
  { name: 'B.Tech Mechanical Engineering', code: 'MECH-BTECH', departmentCode: 'MECH', durationSemesters: 8 },
  { name: 'B.Tech Civil Engineering', code: 'CIVIL-BTECH', departmentCode: 'CIVIL', durationSemesters: 8 },
];

const run = async () => {
  await connectDB();

  for (const { departmentCode, ...course } of DEFAULT_COURSES) {
    const department = await Department.findOne({ code: departmentCode });
    if (!department) {
      console.warn(`Department ${departmentCode} not found. Skipping course ${course.code}. Run seed:departments first.`);
      continue;
    }

    const existing = await Course.findOne({ code: course.code });
    if (existing) {
      console.log(`Course already exists: ${course.code}. Skipping.`);
      continue;
    }

    await Course.create({ ...course, department: department._id });
    console.log(`Course created: ${course.code} - ${course.name}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to seed courses:', err);
  process.exit(1);
});

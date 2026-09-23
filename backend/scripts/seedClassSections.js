require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Course = require('../models/courseModel');
const AcademicYear = require('../models/academicYearModel');
const ClassSection = require('../models/classSectionModel');

const COURSE_CODES = ['CSE-BTECH', 'IT-BTECH', 'ECE-BTECH', 'EEE-BTECH', 'MECH-BTECH', 'CIVIL-BTECH'];
const ACADEMIC_YEAR_NAME = '2025-2026';
const SECTION = 'A';
const CAPACITY = 60;

const run = async () => {
  await connectDB();

  const academicYear = await AcademicYear.findOne({ name: ACADEMIC_YEAR_NAME });
  if (!academicYear) {
    console.error(`Academic year ${ACADEMIC_YEAR_NAME} not found. Run seed:academic-years first.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  for (const courseCode of COURSE_CODES) {
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      console.warn(`Course ${courseCode} not found. Skipping. Run seed:courses first.`);
      continue;
    }

    const name = `${course.name} - Year 1 Section ${SECTION}`;
    const existing = await ClassSection.findOne({ course: course._id, academicYear: academicYear._id, section: SECTION });
    if (existing) {
      console.log(`Class section already exists: ${name}. Skipping.`);
      continue;
    }

    await ClassSection.create({
      name,
      course: course._id,
      academicYear: academicYear._id,
      section: SECTION,
      capacity: CAPACITY,
    });
    console.log(`Class section created: ${name}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to seed class sections:', err);
  process.exit(1);
});

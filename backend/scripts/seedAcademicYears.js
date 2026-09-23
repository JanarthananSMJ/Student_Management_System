require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AcademicYear = require('../models/academicYearModel');

const DEFAULT_ACADEMIC_YEARS = [
  { name: '2025-2026', startDate: new Date('2025-06-01'), endDate: new Date('2026-05-31'), isCurrent: true },
];

const run = async () => {
  await connectDB();

  for (const year of DEFAULT_ACADEMIC_YEARS) {
    const existing = await AcademicYear.findOne({ name: year.name });
    if (existing) {
      console.log(`Academic year already exists: ${year.name}. Skipping.`);
      continue;
    }
    await AcademicYear.create(year);
    console.log(`Academic year created: ${year.name}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to seed academic years:', err);
  process.exit(1);
});

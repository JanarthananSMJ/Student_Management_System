require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/userModel');

const DEFAULT_EMAIL = 'admin@example.com';
const DEFAULT_PASSWORD = 'Admin@12345';

const run = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log(`Admin already exists (${existingAdmin.email}). Skipping seed.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const email = process.env.ADMIN_EMAIL || DEFAULT_EMAIL;
  const password = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn(
      'WARNING: ADMIN_EMAIL/ADMIN_PASSWORD not set in .env — using default credentials. Change the admin password after first login.',
    );
  }

  await User.create({
    name: 'Administrator',
    email,
    password,
    role: 'admin',
    status: 'active',
    mustChangePassword: true,
  });

  console.log(`Admin user created successfully: ${email}`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to seed admin user:', err);
  process.exit(1);
});

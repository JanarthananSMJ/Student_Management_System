require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb', extended: true }));

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/academic-years', require('./routes/academicYearRoutes'));
app.use('/api/semesters', require('./routes/semesterRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/class-sections', require('./routes/classSectionRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// MongoDB connection
connectDB();

// Error handling (must be after all routes)
app.use(notFound);
app.use(errorHandler);

// listening the server
app.listen(port, () => console.log(`Server is running at ${port}`));

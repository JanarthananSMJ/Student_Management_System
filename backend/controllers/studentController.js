const Student = require('../models/studentModel');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');

const SAFE_USER_FIELDS = 'name email role status mustChangePassword';
const POPULATE = ['department', 'course', 'classSection', { path: 'user', select: SAFE_USER_FIELDS }];

const getStudents = asyncHandler(async (req, res) => {
  const {
    department, course, status, search,
  } = req.query;
  const filter = {};

  if (department) filter.department = department;
  if (course) filter.course = course;
  if (status) filter.status = status;

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { rollNumber: regex },
      { 'personalDetails.firstName': regex },
      { 'personalDetails.lastName': regex },
    ];
  }

  const students = await Student.find(filter).populate(POPULATE);
  res.status(200).json(students);
});

const getStudent = asyncHandler(async (req, res) => {
  if (req.user.role === 'student') {
    const own = await Student.findOne({ user: req.user._id });
    if (!own || own._id.toString() !== req.params.id) {
      res.status(403).json({ message: 'Not authorized to view this student' });
      return;
    }
  }

  const student = await Student.findById(req.params.id).populate(POPULATE);
  if (!student) {
    res.status(404).json({ message: 'Student not found' });
    return;
  }
  res.status(200).json(student);
});

const createStudent = asyncHandler(async (req, res) => {
  const {
    name, email, password, ...studentFields
  } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role: 'student',
  });

  try {
    const student = await Student.create({ ...studentFields, user: user._id });
    const populated = await student.populate(POPULATE);
    res.status(201).json(populated);
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    throw err;
  }
});

const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404).json({ message: 'Student not found' });
    return;
  }

  let updates = req.body;

  if (req.user.role === 'student') {
    if (student.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this student' });
      return;
    }

    const allowed = {};
    if (updates.contact !== undefined) allowed.contact = updates.contact;
    if (updates.guardian !== undefined) allowed.guardian = updates.guardian;
    if (updates.personalDetails && updates.personalDetails.photo !== undefined) {
      allowed.personalDetails = {
        ...student.personalDetails.toObject(),
        photo: updates.personalDetails.photo,
      };
    }
    updates = allowed;
  } else if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Not authorized to update students' });
    return;
  }

  Object.assign(student, updates);
  await student.save();
  const populated = await student.populate(POPULATE);
  res.status(200).json(populated);
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    res.status(404).json({ message: 'Student not found' });
    return;
  }
  await User.findByIdAndDelete(student.user);
  res.status(200).json({ message: 'Student deleted successfully' });
});

const uploadDocument = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404).json({ message: 'Student not found' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  student.documents.push({
    name: req.file.originalname,
    url: `/uploads/students/${req.params.id}/${req.file.filename}`,
    uploadedAt: new Date(),
  });

  await student.save();
  const populated = await student.populate(POPULATE);
  res.status(200).json(populated);
});

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadDocument,
};

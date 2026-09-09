const Student = require('../models/studentModel');
const Staff = require('../models/staffModel');
const Department = require('../models/departmentModel');
const Course = require('../models/courseModel');
const asyncHandler = require('../utils/asyncHandler');

const adminDashboard = async () => {
  const [totalStudents, totalStaff, totalDepartments, totalCourses] = await Promise.all([
    Student.countDocuments(),
    Staff.countDocuments(),
    Department.countDocuments(),
    Course.countDocuments(),
  ]);

  const studentsByDepartmentRaw = await Student.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'departments',
        localField: '_id',
        foreignField: '_id',
        as: 'department',
      },
    },
    { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        department: '$department.name',
        count: 1,
      },
    },
  ]);

  const recentAdmissions = await Student.find()
    .sort({ 'admission.admissionDate': -1 })
    .limit(5)
    .populate('department course');

  return {
    totalStudents,
    totalStaff,
    totalDepartments,
    totalCourses,
    studentsByDepartment: studentsByDepartmentRaw,
    recentAdmissions,
  };
};

const staffDashboard = async (userId) => {
  const staff = await Staff.findOne({ user: userId })
    .populate('subjectsHandled')
    .populate('classesAssigned');

  if (!staff) {
    return {
      assignedClassesCount: 0,
      assignedSubjectsCount: 0,
      assignedClasses: [],
      assignedSubjects: [],
    };
  }

  return {
    assignedClassesCount: staff.classesAssigned.length,
    assignedSubjectsCount: staff.subjectsHandled.length,
    assignedClasses: staff.classesAssigned,
    assignedSubjects: staff.subjectsHandled,
  };
};

const studentDashboard = async (userId) => {
  const student = await Student.findOne({ user: userId }).populate(
    'department course classSection',
  );
  return { profile: student };
};

const getDashboard = asyncHandler(async (req, res) => {
  let data;

  if (req.user.role === 'admin') {
    data = await adminDashboard();
  } else if (req.user.role === 'staff') {
    data = await staffDashboard(req.user._id);
  } else {
    data = await studentDashboard(req.user._id);
  }

  res.status(200).json(data);
});

module.exports = { getDashboard };

const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Staff = require('../models/staffModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase().trim() }).select('+password');

  if (!user || !(await user.matchPassword(password)) || user.status !== 'active') {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  res.status(200).json({
    token: generateToken(user._id, user.role),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  const { user } = req;

  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    mustChangePassword: user.mustChangePassword,
  };

  if (user.role === 'student') {
    const profile = await Student.findOne({ user: user._id })
      .populate('department course classSection')
      .populate({ path: 'user', select: 'name email role status' });
    payload.profile = profile;
  } else if (user.role === 'staff') {
    const profile = await Staff.findOne({ user: user._id })
      .populate('department subjectsHandled classesAssigned')
      .populate({ path: 'user', select: 'name email role status' });
    payload.profile = profile;
  }

  res.status(200).json(payload);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400).json({ message: 'Current password is incorrect' });
    return;
  }

  user.password = newPassword;
  user.mustChangePassword = false;
  await user.save();

  res.status(200).json({ message: 'Password changed successfully' });
});

module.exports = { login, getMe, changePassword };

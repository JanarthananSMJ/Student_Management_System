const Staff = require('../models/staffModel');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');

const SAFE_USER_FIELDS = 'name email role status mustChangePassword';
const POPULATE = ['department', 'subjectsHandled', 'classesAssigned', { path: 'user', select: SAFE_USER_FIELDS }];

const getStaffList = asyncHandler(async (req, res) => {
  const staff = await Staff.find().populate(POPULATE);
  res.status(200).json(staff);
});

const getStaffMember = asyncHandler(async (req, res) => {
  if (req.user.role === 'staff') {
    const own = await Staff.findOne({ user: req.user._id });
    if (!own || own._id.toString() !== req.params.id) {
      res.status(403).json({ message: 'Not authorized to view this staff member' });
      return;
    }
  } else if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Not authorized to view this staff member' });
    return;
  }

  const staff = await Staff.findById(req.params.id).populate(POPULATE);
  if (!staff) {
    res.status(404).json({ message: 'Staff member not found' });
    return;
  }
  res.status(200).json(staff);
});

const createStaff = asyncHandler(async (req, res) => {
  const {
    name, email, password, ...staffFields
  } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role: 'staff',
  });

  try {
    const staff = await Staff.create({ ...staffFields, user: user._id });
    const populated = await staff.populate(POPULATE);
    res.status(201).json(populated);
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    throw err;
  }
});

const updateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    res.status(404).json({ message: 'Staff member not found' });
    return;
  }

  let updates = req.body;

  if (req.user.role === 'staff') {
    if (staff.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this staff member' });
      return;
    }

    const allowed = {};
    if (updates.phone !== undefined) allowed.phone = updates.phone;
    if (updates.address !== undefined) allowed.address = updates.address;
    updates = allowed;
  } else if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Not authorized to update staff' });
    return;
  }

  Object.assign(staff, updates);
  await staff.save();
  const populated = await staff.populate(POPULATE);
  res.status(200).json(populated);
});

const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);
  if (!staff) {
    res.status(404).json({ message: 'Staff member not found' });
    return;
  }
  await User.findByIdAndDelete(staff.user);
  res.status(200).json({ message: 'Staff member deleted successfully' });
});

module.exports = {
  getStaffList,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
};

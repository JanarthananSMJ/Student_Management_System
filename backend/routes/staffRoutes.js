const express = require('express');
const {
  getStaffList,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getStaffList);
router.get('/:id', protect, getStaffMember);
router.post('/', protect, authorize('admin'), createStaff);
router.patch('/:id', protect, updateStaff);
router.delete('/:id', protect, authorize('admin'), deleteStaff);

module.exports = router;

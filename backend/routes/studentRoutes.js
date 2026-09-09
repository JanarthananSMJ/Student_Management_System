const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadDocument,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin', 'staff'), getStudents);
router.get('/:id', protect, getStudent);
router.post('/', protect, authorize('admin'), createStudent);
router.patch('/:id', protect, updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);
router.post('/:id/documents', protect, authorize('admin'), upload, uploadDocument);

module.exports = router;

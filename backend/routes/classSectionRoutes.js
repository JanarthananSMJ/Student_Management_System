const express = require('express');
const {
  list, getOne, create, update, remove,
} = require('../controllers/classSectionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, list);
router.get('/:id', protect, getOne);
router.post('/', protect, authorize('admin'), create);
router.patch('/:id', protect, authorize('admin'), update);
router.delete('/:id', protect, authorize('admin'), remove);

module.exports = router;

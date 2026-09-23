const Subject = require('../models/subjectModel');
const crudFactory = require('../utils/crudFactory');

module.exports = crudFactory(Subject, [
  'course',
  'semester',
  { path: 'teacher', populate: { path: 'user', select: 'name email' } },
]);

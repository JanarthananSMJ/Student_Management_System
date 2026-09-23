const ClassSection = require('../models/classSectionModel');
const crudFactory = require('../utils/crudFactory');

module.exports = crudFactory(ClassSection, [
  'course',
  'academicYear',
  { path: 'classTeacher', populate: { path: 'user', select: 'name email' } },
]);

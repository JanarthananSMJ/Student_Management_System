const Semester = require('../models/semesterModel');
const crudFactory = require('../utils/crudFactory');

module.exports = crudFactory(Semester, 'academicYear course');

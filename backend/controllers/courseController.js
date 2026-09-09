const Course = require('../models/courseModel');
const crudFactory = require('../utils/crudFactory');

module.exports = crudFactory(Course, 'department');

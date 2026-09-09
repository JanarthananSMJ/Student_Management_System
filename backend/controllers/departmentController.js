const Department = require('../models/departmentModel');
const crudFactory = require('../utils/crudFactory');

module.exports = crudFactory(Department, 'hod');

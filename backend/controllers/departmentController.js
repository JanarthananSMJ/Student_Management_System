const Department = require('../models/departmentModel');
const crudFactory = require('../utils/crudFactory');

module.exports = crudFactory(Department, {
  path: 'hod',
  populate: { path: 'user', select: 'name email' },
});

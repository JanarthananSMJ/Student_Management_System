const asyncHandler = require('./asyncHandler');

// Generates standard list/get/create/update/delete handlers for a simple
// reference-data model. `populate` (string or array) is applied to list+get.
const crudFactory = (Model, populate) => ({
  list: asyncHandler(async (req, res) => {
    let query = Model.find();
    if (populate) query = query.populate(populate);
    const docs = await query;
    res.status(200).json(docs);
  }),

  getOne: asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (populate) query = query.populate(populate);
    const doc = await query;
    if (!doc) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.status(200).json(doc);
  }),

  create: asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  }),

  update: asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.status(200).json(doc);
  }),

  remove: asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.status(200).json({ message: 'Deleted successfully' });
  }),
});

module.exports = crudFactory;

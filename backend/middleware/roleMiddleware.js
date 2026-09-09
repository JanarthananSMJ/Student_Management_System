const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403).json({ message: 'Not authorized for this action' });
    return;
  }
  next();
};

module.exports = { authorize };

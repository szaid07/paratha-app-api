module.exports = (roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ msg: "Access denied." });
  }
};

exports.optional = (req, res, next) => {
  req.required = 'optional'; 
  next();
};
exports.required = (req, res, next) => {
  req.required = 'required'; 
  next();
};
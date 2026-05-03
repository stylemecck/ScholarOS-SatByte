const jwt = require('jsonwebtoken');

const optionalAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return next(); // Continue without user
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    // If token is invalid but provided, we still might want to fail or just ignore
    // Usually, if a token is provided, it should be valid.
    next(); 
  }
};

module.exports = optionalAuthMiddleware;

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorHandler');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new ErrorHandler('No token provided', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return next(new ErrorHandler('User not found or inactive', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler('Token expired', 401));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ErrorHandler('Invalid token', 401));
    }
    next(error);
  }
};

module.exports = authMiddleware;

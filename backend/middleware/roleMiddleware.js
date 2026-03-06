const { ErrorHandler } = require('../utils/errorHandler');

const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler('User not authenticated', 401));
    }

    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!rolesArray.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Access denied. Required role(s): ${rolesArray.join(', ')}`,
          403
        )
      );
    }

    next();
  };
};

module.exports = roleMiddleware;

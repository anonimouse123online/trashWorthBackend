const { errorResponse } = require('../utils/apiResponse');

/**
 * Role Authorization Middleware
 * Restricts access to specific user roles
 * @param {...string} allowedRoles - Roles allowed to access the route
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'User identity not found, authentication required', 401);
    }

    const { role } = req.user;
    if (!role || !allowedRoles.includes(role)) {
      return errorResponse(res, 'Access denied. Insufficient permissions', 403);
    }

    next();
  };
};

module.exports = roleMiddleware;

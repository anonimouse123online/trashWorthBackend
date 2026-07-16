const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Authentication Middleware
 * Verifies Supabase-issued JWT from the Authorization header.
 * Decoded payload is attached to req.user (contains: sub, email, role, etc.)
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 'Authentication token missing', 401);
    }

    // Supabase JWTs are signed with the JWT_SECRET from your project settings
    // (Supabase Dashboard → Project Settings → API → JWT Secret)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured in environment variables');
      return errorResponse(res, 'Server configuration error', 500);
    }

    const decoded = jwt.verify(token, jwtSecret);

    // Attach decoded payload so downstream middleware/controllers can access
    // decoded.sub       = user UUID
    // decoded.email     = user email
    // decoded.role      = user role (from app_metadata or profiles table)
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Authentication token has expired', 401);
    }
    return errorResponse(res, 'Invalid authentication token', 401);
  }
};

module.exports = authMiddleware;

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Protect routes - require a valid JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Get user from database (excluding password)
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      // Attach user info to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

/**
 * Authorize roles - restrict to specific roles
 * @param {...string} roles - Allowed roles (e.g. 'doctor', 'admin', 'dispatcher')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `User role '${req.user?.role || 'anonymous'}' is not authorized to access this resource` 
      });
    }
    next();
  };
};

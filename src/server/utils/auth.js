import jwt from 'jsonwebtoken';
import { User } from '../../db/models/User.js';

/**
 * Extract and verify authorization token, returning the authenticated User object
 */
export const getAuthUser = async (req) => {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Validate that a user has one of the required roles
 */
export const hasRole = (user, roles) => {
  if (!user) return false;
  return roles.includes(user.role);
};

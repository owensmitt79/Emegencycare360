import { AuditLog } from '../models/AuditLog.js';

/**
 * Helper utility to record user activities for audit trails
 * @param {string} action - Type of action (e.g., 'LOGIN_SUCCESS', 'READ_PHI')
 * @param {string|null} userId - The user performing the action
 * @param {object} details - Additional audit details (e.g. { targetUserId: '...' })
 * @param {object|null} req - The Express Request object (to extract IP address)
 */
export const logActivity = async (action, userId = null, details = {}, req = null) => {
  try {
    let ipAddress = null;
    if (req) {
      ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      // Handle array or comma-separated string for proxy forwards
      if (ipAddress && typeof ipAddress === 'string') {
        ipAddress = ipAddress.split(',')[0].trim();
      }
    }
    
    await AuditLog.create({
      action,
      userId,
      details,
      ipAddress,
    });
  } catch (error) {
    // Fail silently in terms of API response, but log to stderr
    console.error('Failed to create audit log entry:', error);
  }
};

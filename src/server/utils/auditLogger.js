import { AuditLog } from '../../db/models/AuditLog.js';

/**
 * Helper utility to record user activities for audit trails.
 * Handles both Express requests and Next.js NextRequest objects.
 */
export const logActivity = async (action, userId = null, details = {}, req = null) => {
  try {
    let ipAddress = null;
    if (req) {
      if (req.headers && typeof req.headers.get === 'function') {
        // NextRequest
        ipAddress = req.ip || req.headers.get('x-forwarded-for');
      } else if (req.headers) {
        // Express Request
        ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
      }
      
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
    console.error('Failed to create audit log entry:', error);
  }
};

import { Router } from 'express';
import {
  createEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergencyStatus,
  cancelEmergency,
} from '../controllers/emergencyController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createEmergency);
router.get('/', authenticate, getEmergencies);
router.get('/:id', authenticate, getEmergencyById);
router.put('/:id/status', authenticate, authorize('dispatcher', 'admin'), updateEmergencyStatus);
router.delete('/:id', authenticate, cancelEmergency);

export default router;

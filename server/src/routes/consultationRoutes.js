import { Router } from 'express';
import {
  scheduleConsultation,
  getConsultations,
  getConsultationById,
  updateConsultationStatus,
  cancelConsultation,
} from '../controllers/consultationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, scheduleConsultation);
router.get('/', authenticate, getConsultations);
router.get('/:id', authenticate, getConsultationById);
router.put('/:id/status', authenticate, authorize('doctor', 'admin'), updateConsultationStatus);
router.delete('/:id', authenticate, cancelConsultation);

export default router;

import { Router } from 'express';
import {
  registerDoctor,
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  updateDoctorAvailability,
} from '../controllers/doctorController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/register', authenticate, registerDoctor);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/profile', authenticate, authorize('doctor', 'admin'), updateDoctorProfile);
router.put('/availability', authenticate, authorize('doctor', 'admin'), updateDoctorAvailability);

export default router;

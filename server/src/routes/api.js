import { Router } from 'express';
import { Op } from 'sequelize';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import { EmergencyRequest } from '../models/EmergencyRequest.js';
import { Responder, Ambulance, PartnerHospital, Consultation, Message } from '../models/OtherModels.js';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../utils/auditLogger.js';

const router = Router();

// ---------------------------------------------------------
// Emergency Requests
// ---------------------------------------------------------

router.get('/emergency-requests', protect, async (req, res) => {
  try {
    const { status, user } = req.query;
    let whereClause = {};
    
    if (status === 'active') {
      whereClause.status = { [Op.notIn]: ['completed', 'cancelled'] };
    } else if (status) {
      whereClause.status = status;
    }

    // HIPAA Security Rule: Patients can only view their own requests.
    if (req.user.role === 'patient') {
      whereClause.userId = req.user.id;
    } else if (user) {
      whereClause.userId = user;
    }
    
    const results = await EmergencyRequest.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name', 'email', 'phone']
      }]
    });

    await logActivity('READ_EMERGENCY_LIST', req.user.id, { count: results.length, filter: status }, req);
    res.json({ items: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/emergency-requests', protect, async (req, res) => {
  try {
    const { user, userId, user_id, ...rest } = req.body;
    // Patients cannot forge emergency requests for other users
    const targetUserId = req.user.role === 'patient' ? req.user.id : (user || userId || user_id || req.user.id);

    const newReq = await EmergencyRequest.create({
      ...rest,
      userId: targetUserId,
      status: 'pending'
    });

    await logActivity('SUBMIT_EMERGENCY', req.user.id, { emergencyRequestId: newReq.id, targetUserId }, req);
    res.status(201).json(newReq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/emergency-requests/:id', protect, async (req, res) => {
  try {
    const { user, userId, user_id, ...rest } = req.body;
    const targetUserId = user || userId || user_id;

    const record = await EmergencyRequest.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found' });

    // Patients can only modify/cancel their own request
    if (req.user.role === 'patient' && record.userId !== req.user.id) {
      await logActivity('UNAUTHORIZED_ACCESS_ATTEMPT', req.user.id, { emergencyRequestId: req.params.id, action: 'modify' }, req);
      return res.status(403).json({ error: 'Not authorized to modify this emergency request.' });
    }

    const updateData = { ...rest };
    if (targetUserId && req.user.role !== 'patient') {
      updateData.userId = targetUserId;
    }

    const oldStatus = record.status;
    await record.update(updateData);

    const details = { emergencyRequestId: record.id };
    if (updateData.status && updateData.status !== oldStatus) {
      details.statusChange = `${oldStatus} -> ${updateData.status}`;
    }
    if (updateData.assigned_responder_id || updateData.assigned_ambulance_id) {
      details.assignments = {
        responder: updateData.assigned_responder_id || record.assigned_responder_id,
        ambulance: updateData.assigned_ambulance_id || record.assigned_ambulance_id,
      };
    }

    await logActivity('UPDATE_EMERGENCY', req.user.id, details, req);
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/emergency-requests/:id', protect, async (req, res) => {
  try {
    const reqItem = await EmergencyRequest.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });
    if (!reqItem) return res.status(404).json({ error: 'Not found' });

    // Patients can only view their own requests
    if (req.user.role === 'patient' && reqItem.userId !== req.user.id) {
      await logActivity('UNAUTHORIZED_ACCESS_ATTEMPT', req.user.id, { emergencyRequestId: req.params.id, action: 'read' }, req);
      return res.status(403).json({ error: 'Not authorized to view this emergency request.' });
    }

    await logActivity('READ_EMERGENCY_DETAILS', req.user.id, { emergencyRequestId: req.params.id }, req);
    res.json(reqItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// Doctors
// ---------------------------------------------------------

router.get('/doctors', protect, async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name', 'email', 'phone']
      }]
    });
    
    const mappedDoctors = doctors.map(d => {
      const doc = d.toJSON();
      if (doc.user) {
        doc.fullName = doc.user.full_name;
        doc.email = doc.user.email;
      }
      return doc;
    });
    
    res.json({ items: mappedDoctors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/doctors/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name', 'email', 'phone']
      }]
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    
    const doc = doctor.toJSON();
    if (doc.user) {
      doc.fullName = doc.user.full_name;
      doc.email = doc.user.email;
    }
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/doctors', protect, authorize('admin'), async (req, res) => {
  try {
    const { user, userId, ...rest } = req.body;
    const targetUserId = user || userId;

    const newDoc = await Doctor.create({
      ...rest,
      userId: targetUserId
    });
    await logActivity('CREATE_DOCTOR_PROFILE', req.user.id, { doctorId: newDoc.id, targetUserId }, req);
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// Responders
// ---------------------------------------------------------

router.get('/responders', protect, authorize('admin', 'dispatcher'), async (req, res) => {
  try {
    const items = await Responder.findAll();
    res.json({ items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/responders/:id', protect, authorize('admin', 'dispatcher'), async (req, res) => {
  try {
    const updated = await Responder.findByPk(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    await updated.update(req.body);
    await logActivity('UPDATE_RESPONDER', req.user.id, { responderId: updated.id }, req);
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Ambulances
// ---------------------------------------------------------

router.get('/ambulances', protect, authorize('admin', 'dispatcher'), async (req, res) => {
  try {
    const items = await Ambulance.findAll();
    res.json({ items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/ambulances/:id', protect, authorize('admin', 'dispatcher'), async (req, res) => {
  try {
    const updated = await Ambulance.findByPk(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    await updated.update(req.body);
    await logActivity('UPDATE_AMBULANCE', req.user.id, { ambulanceId: updated.id }, req);
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Partner Hospitals
// ---------------------------------------------------------

router.get('/partner-hospitals', protect, authorize('admin', 'dispatcher'), async (req, res) => {
  try {
    const items = await PartnerHospital.findAll();
    res.json({ items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/partner-hospitals/:id', protect, authorize('admin', 'dispatcher'), async (req, res) => {
  try {
    const updated = await PartnerHospital.findByPk(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    await updated.update(req.body);
    await logActivity('UPDATE_PARTNER_HOSPITAL', req.user.id, { hospitalId: updated.id }, req);
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Consultations
// ---------------------------------------------------------

router.post('/consultations', protect, async (req, res) => {
  try {
    const { patient, doctor, ...rest } = req.body;
    const newConsultation = await Consultation.create({
      ...rest,
      patientId: patient,
      doctorId: doctor,
      status: 'Pending',
      consultationDate: new Date()
    });
    await logActivity('CREATE_CONSULTATION', req.user.id, { consultationId: newConsultation.id, patientId: patient, doctorId: doctor }, req);
    res.status(201).json(newConsultation);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Messages (Consultation Chat)
// ---------------------------------------------------------

router.get('/messages/:roomId', protect, async (req, res) => {
  try {
    const msgs = await Message.findAll({
      where: { roomId: req.params.roomId },
      order: [['createdAt', 'ASC']]
    });
    res.json({ items: msgs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/messages/:roomId', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const msg = await Message.create({
      roomId,
      sender: req.body.sender,
      senderName: req.body.senderName,
      text: req.body.text,
    });
    res.status(201).json(msg);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Users (Protected Health Information Profile Updates)
// ---------------------------------------------------------

router.patch('/users/:id', protect, async (req, res) => {
  try {
    // Only the user themselves or an admin can modify profile
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      await logActivity('UNAUTHORIZED_ACCESS_ATTEMPT', req.user.id, { targetUserId: req.params.id, action: 'update_user' }, req);
      return res.status(403).json({ error: 'Not authorized to modify this profile.' });
    }

    const updated = await User.findByPk(req.params.id);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    
    // Check if modifying PHI fields (for HIPAA logging)
    const phiFields = ['blood_type', 'allergies', 'medications', 'emergency_contacts'];
    const isModifyingPhi = phiFields.some(field => req.body[field] !== undefined);

    await updated.update(req.body);
    
    if (isModifyingPhi) {
      await logActivity('UPDATE_PHI', req.user.id, { targetUserId: updated.id, fieldsChanged: Object.keys(req.body).filter(k => phiFields.includes(k)) }, req);
    } else {
      await logActivity('UPDATE_USER_PROFILE', req.user.id, { targetUserId: updated.id }, req);
    }
    
    const userJson = updated.toJSON();
    delete userJson.password;
    res.json(userJson);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Doctor Registration Payment Pipeline
// ---------------------------------------------------------

router.post('/doctors/pay-registration-fee', protect, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found.' });
    }

    if (doctor.registrationFeePaid) {
      return res.status(400).json({ error: 'Registration fee has already been paid.' });
    }

    // Process mock payment (simulating Paystack/Flutterwave processing ₦5000)
    doctor.registrationFeePaid = true;
    await doctor.save();

    await logActivity('DOCTOR_REGISTRATION_PAYMENT_SUCCESS', req.user.id, { amount: 5000, currency: 'NGN' }, req);

    // Return the updated doctor details (with eager loaded doctor association)
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Doctor, as: 'doctor' }]
    });

    res.json({
      message: 'Registration fee of ₦5,000 paid successfully.',
      record: updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import { Router } from 'express';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import { EmergencyRequest } from '../models/EmergencyRequest.js';
import { Responder, Ambulance, PartnerHospital, Consultation, Message } from '../models/OtherModels.js';

const router = Router();

// ---------------------------------------------------------
// Emergency Requests
// ---------------------------------------------------------

router.get('/emergency-requests', async (req, res) => {
  try {
    const { status, user } = req.query;
    let query = {};
    
    if (status === 'active') {
      query.status = { $nin: ['completed', 'cancelled'] };
    } else if (status) {
      query.status = status;
    }

    if (user) {
      query.user = user;
    }
    
    const results = await EmergencyRequest.find(query).populate('user', 'full_name email phone');
    res.json({ items: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/emergency-requests', async (req, res) => {
  try {
    const newReq = await EmergencyRequest.create({
      ...req.body,
      status: 'pending'
    });
    res.status(201).json(newReq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/emergency-requests/:id', async (req, res) => {
  try {
    const updated = await EmergencyRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/emergency-requests/:id', async (req, res) => {
  try {
    const reqItem = await EmergencyRequest.findById(req.params.id).populate('user');
    if (!reqItem) return res.status(404).json({ error: 'Not found' });
    res.json(reqItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// Doctors
// ---------------------------------------------------------

router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'full_name email phone');
    
    // Map to include fullName directly on the doctor object for the frontend
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

router.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'full_name email phone');
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

router.post('/doctors', async (req, res) => {
  try {
    const newDoc = await Doctor.create(req.body);
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// Responders
// ---------------------------------------------------------

router.get('/responders', async (req, res) => {
  try {
    const items = await Responder.find();
    res.json({ items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/responders/:id', async (req, res) => {
  try {
    const updated = await Responder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Ambulances
// ---------------------------------------------------------

router.get('/ambulances', async (req, res) => {
  try {
    const items = await Ambulance.find();
    res.json({ items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/ambulances/:id', async (req, res) => {
  try {
    const updated = await Ambulance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Partner Hospitals
// ---------------------------------------------------------

router.get('/partner-hospitals', async (req, res) => {
  try {
    const items = await PartnerHospital.find();
    res.json({ items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/partner-hospitals/:id', async (req, res) => {
  try {
    const updated = await PartnerHospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Consultations
// ---------------------------------------------------------

router.post('/consultations', async (req, res) => {
  try {
    const newConsultation = await Consultation.create({
      ...req.body,
      status: 'Pending',
      consultationDate: new Date()
    });
    res.status(201).json(newConsultation);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ---------------------------------------------------------
// Messages (Consultation Chat)
// ---------------------------------------------------------

router.get('/messages/:roomId', async (req, res) => {
  try {
    const msgs = await Message.find({ roomId: req.params.roomId }).sort('createdAt');
    res.json({ items: msgs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/messages/:roomId', async (req, res) => {
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
// Users
// ---------------------------------------------------------

router.patch('/users/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;

import Consultation from '../models/Consultation.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export const scheduleConsultation = async (req, res, next) => {
  try {
    const { doctorId, consultationType, scheduledTime, notes } = req.body;

    if (!doctorId || !scheduledTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const consultation = await Consultation.create({
      userId: req.user.id,
      doctorId,
      consultationType: consultationType || 'video',
      scheduledTime,
      notes,
      status: 'scheduled',
      amount: doctor.consultationFee,
    });

    res.status(201).json({
      message: 'Consultation scheduled',
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

export const getConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Doctor,
          include: [{ model: User, attributes: ['firstName', 'lastName'] }],
        },
      ],
      order: [['scheduledTime', 'DESC']],
    });

    res.json({ consultations });
  } catch (error) {
    next(error);
  }
};

export const getConsultationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findByPk(id, {
      include: [
        {
          model: Doctor,
          include: [{ model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] }],
        },
      ],
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (consultation.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ consultation });
  } catch (error) {
    next(error);
  }
};

export const updateConsultationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, prescription } = req.body;

    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    await consultation.update({
      ...(status && { status }),
      ...(notes && { notes }),
      ...(prescription && { prescription }),
      ...(status === 'completed' && { endTime: new Date() }),
      ...(status === 'in-progress' && { startTime: new Date() }),
    });

    res.json({
      message: 'Consultation updated',
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (consultation.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await consultation.update({ status: 'cancelled' });

    res.json({ message: 'Consultation cancelled', consultation });
  } catch (error) {
    next(error);
  }
};

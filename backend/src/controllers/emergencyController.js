import Emergency from '../models/Emergency.js';
import User from '../models/User.js';

export const createEmergency = async (req, res, next) => {
  try {
    const { emergencyType, description, location, severity } = req.body;

    if (!emergencyType || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const emergency = await Emergency.create({
      userId: req.user.id,
      emergencyType,
      description,
      location,
      severity: severity || 'high',
      status: 'pending',
    });

    res.status(201).json({
      message: 'Emergency request created',
      emergency,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmergencies = async (req, res, next) => {
  try {
    const emergencies = await Emergency.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({ emergencies });
  } catch (error) {
    next(error);
  }
};

export const getEmergencyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const emergency = await Emergency.findByPk(id);

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    if (emergency.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ emergency });
  } catch (error) {
    next(error);
  }
};

export const updateEmergencyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedResponder } = req.body;

    const emergency = await Emergency.findByPk(id);

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    await emergency.update({
      ...(status && { status }),
      ...(notes && { notes }),
      ...(assignedResponder && { assignedResponder }),
    });

    res.json({
      message: 'Emergency updated',
      emergency,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelEmergency = async (req, res, next) => {
  try {
    const { id } = req.params;

    const emergency = await Emergency.findByPk(id);

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    if (emergency.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await emergency.update({ status: 'cancelled' });

    res.json({ message: 'Emergency cancelled', emergency });
  } catch (error) {
    next(error);
  }
};

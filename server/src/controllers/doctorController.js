import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export const registerDoctor = async (req, res, next) => {
  try {
    const { specialization, licenseNumber, yearsOfExperience, hospitalAffiliation, consultationFee } = req.body;

    if (!specialization || !licenseNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingDoctor = await Doctor.findOne({ where: { licenseNumber } });
    if (existingDoctor) {
      return res.status(400).json({ message: 'License number already registered' });
    }

    const doctor = await Doctor.create({
      userId: req.user.id,
      specialization,
      licenseNumber,
      yearsOfExperience,
      hospitalAffiliation,
      consultationFee,
    });

    await User.update({ role: 'doctor' }, { where: { id: req.user.id } });

    res.status(201).json({
      message: 'Doctor profile created',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctors = async (req, res, next) => {
  try {
    const { specialization, availabilityStatus } = req.query;

    const where = {};
    if (specialization) where.specialization = specialization;
    if (availabilityStatus) where.availabilityStatus = availabilityStatus;

    const doctors = await Doctor.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'profilePicture', 'verified'],
        },
      ],
    });

    res.json({ doctors });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'profilePicture', 'verified'],
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ doctor });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorProfile = async (req, res, next) => {
  try {
    const { specialization, hospitalAffiliation, consultationFee, availabilityStatus } = req.body;

    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    await doctor.update({
      ...(specialization && { specialization }),
      ...(hospitalAffiliation && { hospitalAffiliation }),
      ...(consultationFee && { consultationFee }),
      ...(availabilityStatus && { availabilityStatus }),
    });

    res.json({
      message: 'Doctor profile updated',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorAvailability = async (req, res, next) => {
  try {
    const { availabilityStatus } = req.body;

    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    await doctor.update({ availabilityStatus });

    res.json({
      message: 'Availability updated',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

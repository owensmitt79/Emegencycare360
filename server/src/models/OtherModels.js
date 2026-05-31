import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './User.js';
import { Doctor } from './Doctor.js';

export class Responder extends Model {}
Responder.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employee_id: { type: DataTypes.STRING },
  certification_number: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'available' },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_responses: { type: DataTypes.INTEGER, defaultValue: 0 },
  current_latitude: { type: DataTypes.FLOAT },
  current_longitude: { type: DataTypes.FLOAT },
  base_location_id: { type: DataTypes.JSON, allowNull: true },
}, { sequelize, modelName: 'Responder' });

export class Ambulance extends Model {}
Ambulance.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vehicle_number: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'available' },
  fuel_level: { type: DataTypes.FLOAT },
  current_latitude: { type: DataTypes.FLOAT },
  current_longitude: { type: DataTypes.FLOAT },
}, { sequelize, modelName: 'Ambulance' });

export class PartnerHospital extends Model {}
PartnerHospital.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  emergency_phone: { type: DataTypes.STRING },
  capacity_status: { type: DataTypes.STRING },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
}, { sequelize, modelName: 'PartnerHospital' });

export class Consultation extends Model {}
Consultation.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  consultationDate: { type: DataTypes.DATE },
}, { sequelize, modelName: 'Consultation' });

export class Message extends Model {}
Message.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  roomId: { type: DataTypes.STRING, allowNull: false },
  sender: { type: DataTypes.STRING },
  senderName: { type: DataTypes.STRING },
  text: { type: DataTypes.TEXT },
}, { sequelize, modelName: 'Message' });

// Associations
User.hasMany(Consultation, { foreignKey: 'patientId', as: 'consultations', onDelete: 'CASCADE' });
Consultation.belongsTo(User, { foreignKey: 'patient', as: 'patientUser', onDelete: 'CASCADE' }); // Patient User relation

Doctor.hasMany(Consultation, { foreignKey: 'doctorId', as: 'consultations', onDelete: 'CASCADE' });
Consultation.belongsTo(Doctor, { foreignKey: 'doctor', as: 'doctorProfile', onDelete: 'CASCADE' }); // Doctor profile relation

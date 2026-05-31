import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './User.js';

export class EmergencyRequest extends Model {}

EmergencyRequest.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  emergency_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'medium',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isE164(value) {
        if (value && !/^\+[1-9]\d{1,14}$/.test(value)) {
          throw new Error('Contact phone number must follow E.164 format (e.g. +1234567890)');
        }
      }
    }
  },
  symptoms_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assigned_responder_id: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: null,
  },
  assigned_ambulance_id: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: null,
  },
}, {
  sequelize,
  modelName: 'EmergencyRequest',
});

// Associations
User.hasMany(EmergencyRequest, { foreignKey: 'userId', as: 'emergencyRequests', onDelete: 'CASCADE' });
EmergencyRequest.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

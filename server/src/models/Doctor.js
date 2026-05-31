import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './User.js';

export class Doctor extends Model {}

Doctor.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verificationStatus: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Rejected'),
    defaultValue: 'Pending',
  },
  registrationFeePaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  availableForChat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  availableForVoiceCalls: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  availableForVideoCalls: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalConsultations: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  hospitalName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  consultationFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  profilePictureUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Doctor',
});

// Define associations
User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctor', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

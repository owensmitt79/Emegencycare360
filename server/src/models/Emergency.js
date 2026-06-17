import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Emergency = sequelize.define('Emergency', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  emergencyType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true, // { latitude, longitude, address }
  },
  status: {
    type: DataTypes.ENUM('pending', 'assigned', 'in-transit', 'arrived', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  severity: {
    type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
    defaultValue: 'high',
  },
  assignedResponder: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  estimatedArrivalTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Emergency;

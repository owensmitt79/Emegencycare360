import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Doctor = sequelize.define('Doctor', {
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
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  hospitalAffiliation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  availabilityStatus: {
    type: DataTypes.ENUM('available', 'busy', 'offline'),
    defaultValue: 'offline',
  },
  consultationFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalConsultations: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  staffNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
}, {
  hooks: {
    beforeCreate: (doctor) => {
      if (!doctor.staffNumber) {
        doctor.staffNumber = `STF-${Math.floor(100000 + Math.random() * 900000)}`;
      }
    }
  }
});

export default Doctor;

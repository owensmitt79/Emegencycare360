import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';
import bcrypt from 'bcrypt';
import { encrypt, decrypt } from '../../server/utils/crypto.js';

export class User extends Model {
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(value) {
      if (value) {
        this.setDataValue('email', value.toLowerCase().trim());
      }
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('patient', 'doctor', 'admin', 'dispatcher'),
    defaultValue: 'patient',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isE164(value) {
        if (value && !/^\+[1-9]\d{1,14}$/.test(value)) {
          throw new Error('Phone number must follow E.164 format (e.g. +1234567890)');
        }
      }
    }
  },
  blood_type: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const val = this.getDataValue('blood_type');
      return val ? decrypt(val) : null;
    },
    set(value) {
      this.setDataValue('blood_type', value ? encrypt(value) : null);
    }
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const val = this.getDataValue('allergies');
      return val ? decrypt(val) : null;
    },
    set(value) {
      this.setDataValue('allergies', value ? encrypt(value) : null);
    }
  },
  medications: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const val = this.getDataValue('medications');
      return val ? decrypt(val) : null;
    },
    set(value) {
      this.setDataValue('medications', value ? encrypt(value) : null);
    }
  },
  emergency_contacts: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const val = this.getDataValue('emergency_contacts');
      if (!val) return [];
      try {
        const decrypted = decrypt(val);
        return JSON.parse(decrypted);
      } catch (e) {
        try {
          return JSON.parse(val);
        } catch (err) {
          return [];
        }
      }
    },
    set(value) {
      const str = JSON.stringify(value || []);
      this.setDataValue('emergency_contacts', encrypt(str));
    }
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verificationTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'User',
  indexes: [
    {
      fields: ['role'],
    },
    {
      fields: ['email', 'role'],
    }
  ],
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

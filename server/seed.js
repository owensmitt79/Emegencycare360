import dotenv from 'dotenv';
import sequelize from './src/config/database.js';
import User from './src/models/User.js';
import Doctor from './src/models/Doctor.js';
import Emergency from './src/models/Emergency.js';
import Consultation from './src/models/Consultation.js';

dotenv.config();

// Model associations
User.hasOne(Doctor, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Emergency, { foreignKey: 'userId' });
Emergency.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Consultation, { foreignKey: 'userId' });
Consultation.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(Consultation, { foreignKey: 'doctorId' });
Consultation.belongsTo(Doctor, { foreignKey: 'doctorId' });

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');
    
    // Sync models
    await sequelize.sync({ alter: true });

    // Seed Admin
    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@test.com' },
      defaults: {
        firstName: 'System',
        lastName: 'Admin',
        password: 'admin123',
        role: 'admin',
        verified: true
      }
    });
    if (adminCreated) {
      console.log('Admin user (admin@test.com / admin123) created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    // Seed Doctor
    const [doctorUser, doctorCreated] = await User.findOrCreate({
      where: { email: 'doctor@test.com' },
      defaults: {
        firstName: 'John',
        lastName: 'Doe',
        password: 'doctor123',
        role: 'doctor',
        verified: true
      }
    });
    
    if (doctorCreated) {
      console.log('Doctor user (doctor@test.com / doctor123) created successfully.');
      
      await Doctor.create({
        userId: doctorUser.id,
        specialization: 'General Practice',
        licenseNumber: 'MD' + Math.floor(1000 + Math.random() * 9000),
        yearsOfExperience: 5,
        hospitalAffiliation: 'Central Hospital',
        availabilityStatus: 'available'
      });
      console.log('Doctor profile created successfully.');
    } else {
      console.log('Doctor user already exists.');
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();

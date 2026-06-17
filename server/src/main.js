import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Emergency from './models/Emergency.js';
import Consultation from './models/Consultation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Model associations
User.hasOne(Doctor, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Emergency, { foreignKey: 'userId' });
Emergency.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Consultation, { foreignKey: 'userId' });
Consultation.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(Consultation, { foreignKey: 'doctorId' });
Consultation.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/consultations', consultationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Database sync and server start
sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database sync failed:', error);
    process.exit(1);
  });

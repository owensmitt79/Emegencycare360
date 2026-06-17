# EmergencyCare360 - Backend & Frontend Integration Complete

## ✅ What's Been Created

### Backend (Express.js + MySQL + Sequelize)
1. **Complete REST API** with full CRUD operations
2. **Database Models**: User, Doctor, Emergency, Consultation
3. **Authentication**: JWT-based with role-based authorization
4. **Controllers**: Auth, Doctor, Emergency, Consultation management
5. **Middleware**: Error handling, authentication, authorization
6. **Security**: Password hashing (bcrypt), JWT tokens, CORS, Helmet

### Frontend Client
- `src/lib/backendClient.js` - Ready-to-use API client for all endpoints

## 🚀 Quick Start Guide

### 1. Install & Setup MySQL

#### Windows with XAMPP/WAMP:
1. Download XAMPP: https://www.apachefriends.org/
2. Install and start MySQL from control panel
3. Default: localhost:3306, root user (no password)

#### Windows with MySQL Installer:
1. Download MySQL: https://dev.mysql.com/downloads/windows/installer/
2. Follow installation steps
3. Note your credentials

#### Verify MySQL is Running:
```bash
# Test connection
mysql -u root -h localhost
```

### 2. Create Database
```bash
# Open MySQL command line or use a tool like MySQL Workbench
mysql -u root -h localhost

# Then run:
CREATE DATABASE emergencycare360;
```

### 3. Start Backend Server
```bash
cd server
npm run dev
```

Expected output:
```
Server running on port 5000
Database synced
```

### 4. Test Backend API
```bash
# Test health check
curl http://localhost:5000/health

# Expected response:
{"message":"Server is running"}
```

### 5. Frontend Configuration

Add to `next.config.js` or `.env.local`:
```bash
# .env.local
REACT_APP_API_URL=http://localhost:5000/api
```

## 📋 API Endpoints Summary

### Auth
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/verify-email
GET    /api/auth/me (Protected)
PUT    /api/auth/profile (Protected)
```

### Doctors
```
POST   /api/doctors/register (Protected)
GET    /api/doctors
GET    /api/doctors/:id
PUT    /api/doctors/profile (Protected)
PUT    /api/doctors/availability (Protected)
```

### Emergencies
```
POST   /api/emergencies (Protected)
GET    /api/emergencies (Protected)
GET    /api/emergencies/:id (Protected)
PUT    /api/emergencies/:id/status (Dispatcher/Admin)
DELETE /api/emergencies/:id (Protected)
```

### Consultations
```
POST   /api/consultations (Protected)
GET    /api/consultations (Protected)
GET    /api/consultations/:id (Protected)
PUT    /api/consultations/:id/status (Doctor/Admin)
DELETE /api/consultations/:id (Protected)
```

## 🔌 Using Backend in Frontend Components

### Example: Login Component
```javascript
import apiClient from '@/lib/backendClient';

async function handleLogin(email, password) {
  try {
    const response = await apiClient.login(email, password);
    apiClient.setToken(response.token);
    // Store user data in context/state
    console.log('User:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### Example: Emergency Request
```javascript
async function handleEmergency(emergencyData) {
  try {
    const response = await apiClient.createEmergency({
      emergencyType: 'Heart Attack',
      description: 'Severe chest pain',
      location: {
        latitude: 6.5244,
        longitude: 3.3792,
        address: 'Lagos, Nigeria'
      },
      severity: 'critical'
    });
    console.log('Emergency created:', response.emergency);
  } catch (error) {
    console.error('Failed to create emergency:', error);
  }
}
```

### Example: Get Doctors
```javascript
async function loadDoctors(specialization) {
  try {
    const response = await apiClient.getDoctors({ 
      specialization,
      availabilityStatus: 'available'
    });
    setDoctors(response.doctors);
  } catch (error) {
    console.error('Failed to load doctors:', error);
  }
}
```

## 🔐 Authentication Flow

1. **Signup/Login**: User provides credentials
2. **Token Received**: Backend returns JWT token
3. **Store Token**: `apiClient.setToken(token)` saves to localStorage
4. **Protected Requests**: Token automatically added to Authorization header
5. **Logout**: `apiClient.clearToken()` removes token

## 📁 Backend File Structure

```
server/src/
├── config/
│   └── database.js              # MySQL Sequelize config
├── models/
│   ├── User.js                  # User account & auth
│   ├── Doctor.js                # Doctor profile & specialization
│   ├── Emergency.js             # Emergency requests
│   └── Consultation.js          # Scheduled appointments
├── controllers/
│   ├── authController.js        # Login, signup, profile
│   ├── doctorController.js      # Doctor registration & profile
│   ├── emergencyController.js   # Emergency handling
│   └── consultationController.js# Appointment management
├── routes/
│   ├── authRoutes.js
│   ├── doctorRoutes.js
│   ├── emergencyRoutes.js
│   └── consultationRoutes.js
├── middleware/
│   ├── auth.js                  # JWT & authorization
│   └── errorHandler.js          # Error handling
├── utils/
│   ├── jwt.js                   # Token operations
│   └── password.js              # Hash/compare passwords
└── main.js                       # Express app
```

## 🛠️ Environment Variables (server/.env)

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=emergencycare360
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
```

## ⚠️ Troubleshooting

### MySQL Connection Error
**Problem**: `ConnectionRefusedError`
**Solution**: Start MySQL service (XAMPP/WAMP) and verify connection

### Port Already in Use
**Problem**: `EADDRINUSE: address already in use :::5000`
**Solution**: Change PORT in `.env` or kill process using port 5000

### Database Not Created
**Problem**: `Unknown database 'emergencycare360'`
**Solution**: Run `CREATE DATABASE emergencycare360;` in MySQL

### JWT Token Invalid
**Problem**: `401 - Invalid or expired token`
**Solution**: Token expired or corrupted. User needs to login again

## 🔄 Running Both Frontend & Backend

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## 📚 Next Steps

1. ✅ Install MySQL
2. ✅ Create database
3. ✅ Start backend (`npm run dev` in server folder)
4. ✅ Start frontend (`npm run dev` in root folder)
5. Update frontend components to use `apiClient` instead of mock data
6. Test login/signup flow
7. Test emergency, consultation, and doctor features

## 🎯 Key Features Implemented

- ✅ User authentication with JWT
- ✅ Role-based access control (user, doctor, dispatcher, admin)
- ✅ Doctor registration and profile management
- ✅ Emergency request creation and tracking
- ✅ Consultation scheduling and management
- ✅ Error handling and validation
- ✅ Database models with relationships
- ✅ Security with bcrypt and CORS

Your backend is now ready to control the frontend!

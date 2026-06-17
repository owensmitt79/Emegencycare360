backend-setup-guide.md

# Backend Setup Guide - EmergencyCare360

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js           # Sequelize configuration
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Doctor.js             # Doctor profile model
│   │   ├── Emergency.js          # Emergency request model
│   │   └── Consultation.js       # Consultation model
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── doctorController.js   # Doctor management
│   │   ├── emergencyController.js# Emergency handling
│   │   └── consultationController.js # Consultation management
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── emergencyRoutes.js
│   │   └── consultationRoutes.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication & authorization
│   │   └── errorHandler.js      # Global error handling
│   ├── utils/
│   │   ├── jwt.js               # JWT token operations
│   │   └── password.js          # Password hashing/comparison
│   └── main.js                   # Express app entry point
├── .env                          # Environment variables
└── package.json
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Database
Update `server/.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=emergencycare360
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=emergencycare360
```

### 3. Create Database
```sql
CREATE DATABASE emergencycare360;
```

### 4. Start Backend Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Doctors
- `POST /api/doctors/register` - Register as doctor (Protected)
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/profile` - Update doctor profile (Protected)
- `PUT /api/doctors/availability` - Update availability (Protected)

### Emergencies
- `POST /api/emergencies` - Create emergency (Protected)
- `GET /api/emergencies` - Get user emergencies (Protected)
- `GET /api/emergencies/:id` - Get emergency details (Protected)
- `PUT /api/emergencies/:id/status` - Update status (Dispatcher/Admin)
- `DELETE /api/emergencies/:id` - Cancel emergency (Protected)

### Consultations
- `POST /api/consultations` - Schedule consultation (Protected)
- `GET /api/consultations` - Get user consultations (Protected)
- `GET /api/consultations/:id` - Get consultation details (Protected)
- `PUT /api/consultations/:id/status` - Update status (Doctor/Admin)
- `DELETE /api/consultations/:id` - Cancel consultation (Protected)

## Frontend Integration

Use the `backendClient.js` in the frontend:

```javascript
import apiClient from '@/lib/backendClient';

// Login
const response = await apiClient.login(email, password);
apiClient.setToken(response.token);

// Create emergency
const emergency = await apiClient.createEmergency({
  emergencyType: 'Heart Attack',
  description: 'Severe chest pain',
  location: { latitude: 6.5244, longitude: 3.3792, address: 'Lagos' },
  severity: 'critical'
});

// Get doctors
const doctors = await apiClient.getDoctors({ specialization: 'Cardiology' });
```

## Authentication Flow

1. User signs up → Returns JWT token
2. Frontend stores token in localStorage
3. Token sent in Authorization header for protected routes
4. Server validates token using JWT middleware
5. Logout clears token from localStorage

## Database Models

### User
- Authentication & Profile management
- Roles: user, doctor, dispatcher, admin

### Doctor
- Medical credentials & specialization
- Availability status
- Rating & consultation fee

### Emergency
- Emergency request details
- Status tracking (pending → completed)
- Location & severity

### Consultation
- Scheduled appointments
- Consultation type (video, audio, chat)
- Prescription & payment tracking

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization
- CORS protection with Helmet
- Request rate limiting
- Input validation with Sequelize models

## Error Handling

All errors return standardized JSON:
```json
{
  "message": "Error description",
  "errors": [] // validation errors if applicable
}
```

Status codes:
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

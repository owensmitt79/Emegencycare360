# EmergencyCare360 Backend

Complete Express.js backend API for the EmergencyCare360 emergency healthcare platform.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Doctor Management**: Doctor registration, profile management, and availability tracking
- **Emergency Handling**: Emergency request creation, tracking, and status management
- **Consultations**: Appointment scheduling and consultation management
- **Security**: Password hashing with bcrypt, CORS protection, helmet security headers
- **Database**: MySQL with Sequelize ORM

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── database.js   # Sequelize database config
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Emergency.js
│   │   └── Consultation.js
│   ├── controllers/      # Request handlers
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── emergencyController.js
│   │   └── consultationController.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── emergencyRoutes.js
│   │   └── consultationRoutes.js
│   ├── middleware/       # Middleware functions
│   │   ├── auth.js       # Authentication & authorization
│   │   └── errorHandler.js
│   ├── utils/            # Utility functions
│   │   ├── jwt.js
│   │   └── password.js
│   └── index.js          # Express app entry point
├── .env                  # Environment variables
├── package.json
└── eslint.config.mjs
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=emergencycare360
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Doctors
- `POST /api/doctors/register` - Register as doctor (protected)
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/profile` - Update doctor profile (protected)
- `PUT /api/doctors/availability` - Update doctor availability (protected)

### Emergencies
- `POST /api/emergencies` - Create emergency request (protected)
- `GET /api/emergencies` - Get user emergencies (protected)
- `GET /api/emergencies/:id` - Get emergency details (protected)
- `PUT /api/emergencies/:id/status` - Update emergency status
- `DELETE /api/emergencies/:id` - Cancel emergency (protected)

### Consultations
- `POST /api/consultations` - Schedule consultation (protected)
- `GET /api/consultations` - Get user consultations (protected)
- `GET /api/consultations/:id` - Get consultation details (protected)
- `PUT /api/consultations/:id/status` - Update consultation status
- `DELETE /api/consultations/:id` - Cancel consultation (protected)

## Running the Backend

```bash
npm run dev
```

Server runs on `http://localhost:5000`

Health check: `GET http://localhost:5000/health`

## Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE emergencycare360;
```

2. Models are auto-synced on server start

## License

ISC

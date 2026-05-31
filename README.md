# EmergencyCare360

> A full-stack emergency healthcare platform built with **React**, **Node.js/Express**, and **PocketBase** — connecting patients, doctors, and emergency responders in real time.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v7, Vite 7, TailwindCSS 3, Radix UI, Framer Motion |
| **Backend API** | Node.js, Express 5, Helmet, Morgan, express-rate-limit |
| **Database / Auth** | PocketBase (self-hosted, embedded) |
| **Maps** | Leaflet + React-Leaflet |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Monorepo** | npm Workspaces + Concurrently |

---

## Project Structure

```
EmergencyCare360/
├── package.json              # Root config (concurrently)
├── client/                   # React frontend (Vite, port 3000)
│   ├── src/
│   │   ├── App.jsx       # Root router
│   │   ├── pages/        # All page components
│   │   ├── components/   # Shared UI components
│   │   ├── contexts/     # AuthContext, DoctorAuthContext, ConsultantProvider
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities & PocketBase client
│   ├── vite.config.js
│   └── tailwind.config.js
└── server/                   # Backend API and Database
    ├── src/              # Express REST API (Node.js)
    │   ├── main.js       # Server entry point
    │   ├── routes/       # API route handlers
    │   ├── middleware/   # Auth, rate-limit, logging
    │   ├── constants/
    │   └── utils/
    └──
```

---

## Quick Start

### Prerequisites

- **Node.js** v18+ (see `.nvmrc`)
- **npm** v9+

### Install Dependencies

```bash
cd "path/to/EmergencyCare360"
npm install
```

If you encounter peer dependency conflicts:

```bash
npm install --legacy-peer-deps
```

### Start All Services (Dev)

```bash
npm run dev
```

This concurrently starts:

| Service | URL | Description |
|---------|-----|-------------|
| React Web App | http://localhost:3000 | Frontend (Vite HMR) |
| Express API | http://localhost:4000 | REST API |
| 

### Individual Services

```bash
# Frontend only
npm run dev:client

# API only
npm run dev:server

# PocketBase only
npm run dev:pb
```

---

## Environment Variables

Create `apps/api/.env` (already present):

```env
PB_ENCRYPTION_KEY=your_encryption_key_here
```

> **Note:** PocketBase requires `PB_ENCRYPTION_KEY` for encryption at rest. Generate a secure random key for production.

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with emergency CTA |
| `/emergency` | Emergency | Emergency alert & request dispatch |
| `/services` | Services | Platform service offerings |
| `/coverage` | Coverage Map | Interactive map of service coverage (Leaflet) |
| `/firstaid` | First Aid | First aid guides & tips |
| `/about` | About | Team and mission info |
| `/contact` | Contact | Contact form |

### Authenticated / Dashboard Pages

| Page | Role | Description |
|------|------|-------------|
| `DashboardPage` | Patient | User dashboard & emergency history |
| `DoctorDashboardPage` | Doctor | Doctor-specific dashboard |
| `DoctorLoginPage` | Doctor | Doctor sign-in |
| `DoctorRegisterPage` | Doctor | Doctor registration & profile setup |
| `DoctorsAvailabilityPage` | Public | Browse available doctors |
| `DispatcherDashboard` | Dispatcher | Manage and dispatch emergency requests |
| `EmergencyRequestForm` | Patient | Submit an emergency request |
| `EmergencyRequestStatus` | Patient | Track live status of a request |
| `HospitalDirectory` | Public | Browse registered hospitals |
| `ResponderManagementPanel` | Admin | Manage responders |
| `ResponderTrackingMap` | Admin/Dispatcher | Live responder map tracking |
| `UserProfilePage` | Patient | User profile management |

---

## Key Features

- 🚨 **Emergency Request System** — Submit, dispatch, and track emergency requests in real time
- 🗺️ **Coverage Map** — Interactive Leaflet map showing service coverage zones and responder positions
- 👨‍⚕️ **Doctor Portal** — Doctor registration, login, availability management, and dashboard
- 🚑 **Dispatcher Dashboard** — Central hub for managing and routing emergency responses
- 🏥 **Hospital Directory** — Browse and search registered hospitals
- 🩺 **First Aid Guides** — Built-in first aid reference content
- 👤 **Multi-Role Auth** — Separate auth flows for Patients, Doctors, and Dispatchers (via PocketBase)
- 📊 **Analytics** — Charts (Recharts) for response metrics and trends
- 🔒 **Security** — Helmet headers, CORS, rate limiting on the Express API

---

## Auth Contexts

The frontend uses three React context providers:

| Context | File | Manages |
|---------|------|---------|
| `AuthProvider` | `contexts/AuthContext.jsx` | Patient authentication |
| `DoctorAuthProvider` | `contexts/DoctorAuthContext.jsx` | Doctor authentication |
| `ConsultantProvider` | `contexts/ConsultantProvider.jsx` | Consultant/dispatcher state |

---

## Production Build

```bash
npm run build
```

Outputs the compiled frontend to `dist/apps/web/`.

```bash
npm run start
```

Starts the Express API and PocketBase in production mode. The API serves the built frontend as static assets.

---

## Database Migrations

```bash
# Apply pending migrations
npm run migrations:up --prefix server/pb

# Revert last migration
npm run migrations:revert --prefix server/pb

# Snapshot current schema
npm run migrations:snapshot --prefix server/pb

# Update PocketBase binary
npm run update --prefix server/pb
```

---

## Linting

```bash
# Lint all workspaces
npm run lint

# Lint with warnings
npm run lint:warn --prefix apps/web
```

---

## Contact

For support or enquiries, please use the [Contact Page](http://localhost:3000/contact) in the application.

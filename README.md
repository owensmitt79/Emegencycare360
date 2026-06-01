# EmergencyCare360

> A full-stack emergency healthcare platform built with **Next.js (App Router)**, **MySQL (Sequelize)**, and compliant with **US Industry Standards** (HIPAA for data security, ADA/WCAG for accessibility, and E.164 for telephony).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Frontend** | React 18, TailwindCSS 3, Radix UI, Framer Motion |
| **Database** | MySQL (with automated database creation and table syncing) |
| **ORM** | Sequelize 6 |
| **Maps** | Leaflet + React-Leaflet (loaded dynamically for client-only SSR bypass) |
| **Charts** | Recharts |
| **Forms / Validation** | React Hook Form + Zod |
| **Security & Privacy** | AES-256-GCM symmetric encryption for PHI, JWT token session management, HIPAA access audit trails |
| **Telephony** | E.164 phone number formatting and validation |
| **Multilingual** | Context translation manager synced with Google Translate widgets (English, Yoruba, Igbo, Hausa) |
| **Email Service** | Nodemailer with fallback SMTP dispatch and Ethereal mockup previews |

---

## Project Structure

```
EmergencyCare360/
├── next.config.js            # Next.js configurations & Webpack routing aliases
├── tailwind.config.js        # Hoisted Tailwind theme settings
├── package.json              # Unified full-stack dependencies and scripts
├── jsconfig.json             # Import aliases (@/*)
└── src/
    ├── app/                  # Next.js App Router (Pages, layouts & API endpoints)
    │   ├── api/              # API Route Handlers (auth, emergency-requests, etc.)
    │   ├── globals.css       # Stylesheet (Tailwind directives & map overrides)
    │   ├── layout.jsx        # Server Layout (Google Translate initialization script)
    │   └── client-layout.jsx # Client Layout (Auth, translation, and consultant contexts)
    ├── components/           # Reusable UI components
    ├── contexts/             # State managers (Patient/Doctor/Admin Auth, Translation)
    ├── db/                   # MySQL Sequelize configuration & model schemas
    │   ├── db.js             # Database entry (Sequelize client and database creation helper)
    │   └── models/           # Sequelize Models (User, Doctor, EmergencyRequest, AuditLog, OtherModels)
    ├── hooks/                # Custom React hooks
    ├── lib/                  # Frontend API client and routing compatibility layer
    │   ├── apiClient.js      # Unified relative path fetch helper
    │   └── router-compat.jsx # Compatibility shim mapping react-router-dom to next/navigation
    ├── server/               # Server-side utils
    │   └── utils/            # HIPAA AES-256-GCM crypto, nodemailer helpers, and activity logger
    └── views/                # React page-view component instances
```

---

## Environment Variables

Configure a `.env` file at the root workspace:

```env
# Database Settings
DB_NAME=emergencycare360
DB_USER=root
DB_PASS=
DB_HOST=localhost
DB_PORT=3306

# Security
JWT_SECRET=your_jwt_secret_key_here
PATIENT_DATA_KEY=your_symmetric_32_byte_phi_aes_key_here

# App Details
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional SMTP Settings (defaults to Ethereal email if left blank)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
```

---

## Quick Start

### Prerequisites
- **Node.js** v18+ (see `.nvmrc`)
- **MySQL Server** running locally or remotely on port `3306`

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

Next.js will:
1. Connect to your MySQL server and run `CREATE DATABASE IF NOT EXISTS \`emergencycare360\`;`.
2. Synchronize all tables using `sequelize.sync({ alter: true })`.
3. Boot the application on [http://localhost:3000](http://localhost:3000).

---

## Key Features

1. **HIPAA Security compliance:**
   - Patient Protected Health Information (PHI) fields (`blood_type`, `allergies`, `medications`, `emergency_contacts`) are automatically encrypted before writing to MySQL using **AES-256-GCM**, and decrypted on fetch.
   - Comprehensive trace logs (`AuditLogs` table) record details of authentication events (`LOGIN_SUCCESS`, `LOGIN_FAILED`), patient record retrievals (`READ_PHI`), and profile updates (`UPDATE_PHI`).
2. **Email Verification:**
   - Signup sends a 32-character token. Logins are locked until email verification is complete.
   - If no production SMTP is defined, details are automatically printed to the terminal console with a clickable mock **Ethereal email preview link**.
3. **ADA Accessibility (WCAG 2.1):**
   - Appended ARIA attributes on screen reader inputs, dynamic selectors, and triage questionnaires. Optimized contrast configurations.
4. **Multilingual Google Translate Sync:**
   - Dropdown switches between **English, Yoruba, Igbo, and Hausa**.
   - Language selector modifies the browser's `googtrans` cookie, triggering an automated translation of all pages, dashboards, and maps on-the-fly, while custom overrides hide the Translate banner to feel native.
5. **Doctor Registration billing:**
   - Doctors are required to complete a mock ₦5,000 registration fee payment before their account is verified and consulting dashboards are unlocked.

---

## Production Build & Deploy

Compile the production package (compiles assets, pages, and dynamic serverless endpoints):
```bash
npm run build
```

Run the built application:
```bash
npm run start
```

// System accounts — these are the hardcoded credentials for the admin and doctors.
// In production, move these to environment variables and use a real database.

export const SYSTEM_ACCOUNTS = {
  admin: {
    id: 'admin-001',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    full_name: 'System Admin',
    is_verified: true,
  },
  doctors: [
    {
      id: 'doctor-001',
      email: 'doctor@test.com',
      password: 'doctor123',
      role: 'doctor',
      full_name: 'Dr. Test Doctor',
      specialization: 'Emergency Medicine',
      medical_license: 'MED-TEST-1234',
      years_experience: 10,
      hospital: 'Emergencycare360 General',
      is_available: true,
      is_verified: true,
      rating: 5,
      phone: '+2348000000002',
    },
  ],
  patients: [
    {
      id: 'patient-test',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
      full_name: 'Test Patient',
      phone: '+2348000000001',
      is_verified: true,
      emergency_contacts: [],
      blood_type: 'O+',
      allergies: 'None',
      medications: 'None'
    }
  ],
};

// Simple in-memory token store (maps token -> account info)
export const tokenStore = new Map();

// Generate a simple token
export const generateToken = (account) => {
  const token = `${account.role}-${account.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  tokenStore.set(token, { ...account, password: undefined });
  return token;
};

export const verifyToken = (token) => {
  return tokenStore.get(token) || null;
};

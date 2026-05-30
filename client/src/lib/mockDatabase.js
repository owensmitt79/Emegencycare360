/**
 * DEMO DATABASE — replaces PocketBase for local/demo use.
 * All data is stored in localStorage so it persists across page refreshes.
 */

// ─── Seeded Demo Accounts ────────────────────────────────────────────────────

export const DEMO_USERS = {
  'client@demo.com': {
    id: 'user_demo_001',
    email: 'client@demo.com',
    password: 'demo123',
    full_name: 'John Adeyemi',
    phone: '+234 703 878 7313',
    role: 'user',
    blood_type: 'O+',
    allergies: 'Penicillin',
    medications: 'Aspirin 75mg daily',
    emergency_contacts: [
      { id: 1, name: 'Mary Adeyemi', phone: '+234 803 000 0001', relationship: 'Spouse' },
      { id: 2, name: 'James Adeyemi', phone: '+234 803 000 0002', relationship: 'Brother' },
    ],
    is_verified: true,
  },
};

export const DEMO_DOCTORS = {
  'doctor@demo.com': {
    id: 'doc_demo_001',
    email: 'doctor@demo.com',
    password: 'demo123',
    full_name: 'Dr. Chioma Okafor',
    specialization: 'Emergency Medicine',
    phone: '+234 703 000 0001',
    medical_license: 'MDCN-2024-001234',
    years_experience: 12,
    hospital: 'Lagos University Teaching Hospital',
    bio: 'Expert in emergency and trauma care with over 12 years of experience.',
    is_available: true,
    is_verified: true,
    rating: 4.8,
  },
};

export const DEMO_REQUESTS = [
  {
    id: 'req_001',
    user: 'user_demo_001',
    emergency_type: 'medical',
    urgency: 'High',
    status: 'resolved',
    address: '47 Allen Avenue, Ikeja, Lagos',
    symptoms: 'Chest pain and difficulty breathing',
    created: '2026-05-10T14:23:00Z',
  },
  {
    id: 'req_002',
    user: 'user_demo_001',
    emergency_type: 'trauma',
    urgency: 'Critical',
    status: 'resolved',
    address: '23 Adeola Odeku Street, Victoria Island, Lagos',
    symptoms: 'Road traffic accident with multiple injuries',
    created: '2026-04-28T09:15:00Z',
  },
  {
    id: 'req_003',
    user: 'user_demo_001',
    emergency_type: 'pediatric',
    urgency: 'Medium',
    status: 'resolved',
    address: 'Lekki Phase 1, Lagos',
    symptoms: 'High fever and convulsions in child',
    created: '2026-04-15T18:47:00Z',
  },
];

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  userAuth: 'ec360_user_auth',
  doctorAuth: 'ec360_doctor_auth',
  allUsers: 'ec360_all_users',
  allDoctors: 'ec360_all_doctors',
  allRequests: 'ec360_all_requests',
};

// ─── Initialise Storage on First Load ────────────────────────────────────────

const init = () => {
  if (!localStorage.getItem(KEYS.allUsers)) {
    localStorage.setItem(KEYS.allUsers, JSON.stringify(DEMO_USERS));
  }
  if (!localStorage.getItem(KEYS.allDoctors)) {
    localStorage.setItem(KEYS.allDoctors, JSON.stringify(DEMO_DOCTORS));
  }
  if (!localStorage.getItem(KEYS.allRequests)) {
    localStorage.setItem(KEYS.allRequests, JSON.stringify(DEMO_REQUESTS));
  }
};

init();

// ─── Helper Functions ─────────────────────────────────────────────────────────

const getUsers = () => JSON.parse(localStorage.getItem(KEYS.allUsers) || '{}');
const getDoctors = () => JSON.parse(localStorage.getItem(KEYS.allDoctors) || '{}');
const getRequests = () => JSON.parse(localStorage.getItem(KEYS.allRequests) || '[]');

// ─── User Auth API ────────────────────────────────────────────────────────────

export const userAuthApi = {
  /** Returns the currently logged-in user or null */
  currentUser: () => {
    const stored = localStorage.getItem(KEYS.userAuth);
    return stored ? JSON.parse(stored) : null;
  },

  login: (email, password) => {
    const users = getUsers();
    const user = users[email.toLowerCase()];
    if (!user) throw new Error('No account found with that email address.');
    if (user.password !== password) throw new Error('Incorrect password.');
    const { password: _, ...safeUser } = user;
    localStorage.setItem(KEYS.userAuth, JSON.stringify(safeUser));
    return safeUser;
  },

  register: (email, password, fullName, phone) => {
    const users = getUsers();
    if (users[email.toLowerCase()]) throw new Error('An account with this email already exists.');
    const newUser = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      password,
      full_name: fullName,
      phone: phone || '',
      role: 'user',
      blood_type: '',
      allergies: '',
      medications: '',
      emergency_contacts: [],
      is_verified: false,
    };
    users[email.toLowerCase()] = newUser;
    localStorage.setItem(KEYS.allUsers, JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(KEYS.userAuth, JSON.stringify(safeUser));
    return safeUser;
  },

  logout: () => localStorage.removeItem(KEYS.userAuth),

  updateProfile: (userId, updates) => {
    const users = getUsers();
    const userEntry = Object.entries(users).find(([, u]) => u.id === userId);
    if (!userEntry) throw new Error('User not found.');
    const [email, user] = userEntry;
    const updated = { ...user, ...updates };
    users[email] = updated;
    localStorage.setItem(KEYS.allUsers, JSON.stringify(users));
    const { password: _, ...safeUser } = updated;
    localStorage.setItem(KEYS.userAuth, JSON.stringify(safeUser));
    return safeUser;
  },
};

// ─── Doctor Auth API ──────────────────────────────────────────────────────────

export const doctorAuthApi = {
  currentDoctor: () => {
    const stored = localStorage.getItem(KEYS.doctorAuth);
    return stored ? JSON.parse(stored) : null;
  },

  login: (email, password) => {
    const doctors = getDoctors();
    const doctor = doctors[email.toLowerCase()];
    if (!doctor) throw new Error('No doctor account found with that email address.');
    if (doctor.password !== password) throw new Error('Incorrect password.');
    const { password: _, ...safeDoctor } = doctor;
    localStorage.setItem(KEYS.doctorAuth, JSON.stringify(safeDoctor));
    return safeDoctor;
  },

  register: (formData) => {
    const doctors = getDoctors();
    const email = formData.email.toLowerCase();
    if (doctors[email]) throw new Error('A doctor account with this email already exists.');
    const newDoctor = {
      id: `doc_${Date.now()}`,
      email,
      password: formData.password,
      full_name: formData.name || formData.full_name,
      phone: formData.phone || formData.phoneNumber || '',
      specialization: formData.specialization || 'General Practice',
      medical_license: formData.medical_license || formData.medicalLicenseNumber || '',
      years_experience: parseInt(formData.years_experience || formData.yearsOfExperience || 0),
      hospital: formData.hospital || formData.hospitalName || '',
      bio: formData.bio || '',
      is_available: false,
      is_verified: false,
      rating: null,
    };
    doctors[email] = newDoctor;
    localStorage.setItem(KEYS.allDoctors, JSON.stringify(doctors));
    const { password: _, ...safeDoctor } = newDoctor;
    return safeDoctor;
  },

  logout: () => localStorage.removeItem(KEYS.doctorAuth),
};

// ─── Emergency Requests API ───────────────────────────────────────────────────

export const requestsApi = {
  getByUser: (userId) => {
    return getRequests().filter(r => r.user === userId).sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  },

  create: (data) => {
    const requests = getRequests();
    const newRequest = {
      id: `req_${Date.now()}`,
      ...data,
      status: 'pending',
      created: new Date().toISOString(),
    };
    requests.unshift(newRequest);
    localStorage.setItem(KEYS.allRequests, JSON.stringify(requests));
    return newRequest;
  },
};

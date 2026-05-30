// Temporary in-memory database

export const db = {
  emergencyRequests: [
    {
      id: 'req_1',
      emergency_type: 'medical',
      priority: 'high',
      address: '123 Fake St, Lagos',
      latitude: 6.5244,
      longitude: 3.3792,
      status: 'pending',
      contact_phone: '+234 800 000 0001',
      symptoms_description: 'Severe chest pain',
      assigned_responder_id: null,
      assigned_ambulance_id: null,
      created: new Date().toISOString(),
      user: 'patient-test'
    }
  ],
  doctors: [
    {
      id: 'doc_1',
      fullName: 'Dr. Sarah Connor',
      email: 'sarah@example.com',
      specialization: 'Emergency Medicine',
      verificationStatus: 'Verified',
      availableForChat: true,
      availableForVoiceCalls: true,
      availableForVideoCalls: true,
      rating: 4.8,
      totalConsultations: 120,
      yearsOfExperience: 10,
      hospitalName: 'Lagos General Hospital',
      consultationFee: 5000,
      bio: 'Specialist in emergency care with over 10 years of hands-on experience. Available 24/7 for urgent consultations.',
      profilePictureUrl: null
    },
    {
      id: 'doc_2',
      fullName: 'Dr. James Okafor',
      email: 'james.okafor@example.com',
      specialization: 'Cardiology',
      verificationStatus: 'Verified',
      availableForChat: true,
      availableForVoiceCalls: false,
      availableForVideoCalls: true,
      rating: 4.6,
      totalConsultations: 87,
      yearsOfExperience: 14,
      hospitalName: 'St. Nicholas Hospital',
      consultationFee: 8000,
      bio: 'Senior cardiologist with expertise in heart disease management and emergency cardiac care.',
      profilePictureUrl: null
    },
    {
      id: 'doc_3',
      fullName: 'Dr. Amaka Nwosu',
      email: 'amaka@example.com',
      specialization: 'General Practice',
      verificationStatus: 'Verified',
      availableForChat: true,
      availableForVoiceCalls: true,
      availableForVideoCalls: false,
      rating: 4.9,
      totalConsultations: 215,
      yearsOfExperience: 7,
      hospitalName: 'Reddington Hospital',
      consultationFee: 3500,
      bio: 'Compassionate general practitioner focused on preventive care, wellness guidance, and first-line emergency advice.',
      profilePictureUrl: null
    }
  ],
  // messages[roomId] = [{ id, sender, text, timestamp }]
  messages: {},
  responders: [
    {
      id: 'resp_1',
      employee_id: 'RSP-001',
      certification_number: 'CERT-98765',
      status: 'available',
      rating: 4.9,
      total_responses: 45,
      current_latitude: 6.5244,
      current_longitude: 3.3792,
      base_location_id: { name: 'Central Base' }
    }
  ],
  ambulances: [
    {
      id: 'amb_1',
      vehicle_number: 'AMB-LSR-01',
      type: 'advanced',
      status: 'available',
      fuel_level: 85,
      current_latitude: 6.5244,
      current_longitude: 3.3792
    }
  ],
  partnerHospitals: [
    {
      id: 'hosp_1',
      name: 'Lagos General Hospital',
      address: 'Broad St, Lagos Island',
      emergency_phone: '+234 800 123 4567',
      capacity_status: 'available',
      latitude: 6.4541,
      longitude: 3.3947
    }
  ],
  consultations: [],
  users: []
};

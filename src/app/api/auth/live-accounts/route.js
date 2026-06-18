import { NextResponse } from 'next/server';
import { User } from '@/db/models/User.js';
import { Doctor } from '@/db/models/Doctor.js';

export async function GET(req) {
  try {
    // 1. Fetch existing users
    let users = await User.findAll({
      attributes: ['id', 'email', 'full_name', 'role', 'phone', 'is_verified'],
      order: [['createdAt', 'DESC']]
    });

    // 2. If database has no users, seed default accounts automatically for dev testing
    if (users.length === 0) {
      console.log('No users found in database. Seeding default live accounts...');
      
      // Seed Patient/Client
      await User.create({
        email: 'client@demo.com',
        password: 'demo123',
        full_name: 'John Adeyemi',
        phone: '+2347038787313', // E.164 format
        role: 'patient',
        is_verified: true,
      });

      // Seed Doctor
      const doctorUser = await User.create({
        email: 'doctor@demo.com',
        password: 'demo123',
        full_name: 'Dr. Chioma Okafor',
        phone: '+2347030000001', // E.164 format
        role: 'doctor',
        is_verified: true,
      });
      
      await Doctor.create({
        userId: doctorUser.id,
        specialization: 'Emergency Medicine',
        yearsOfExperience: 12,
        hospitalName: 'Lagos University Teaching Hospital',
        bio: 'Expert in emergency and trauma care with over 12 years of experience.',
        verificationStatus: 'Verified',
        registrationFeePaid: true
      });

      // Seed Admin
      await User.create({
        email: 'admin@test.com',
        password: 'admin123',
        full_name: 'System Admin',
        phone: '+2348030000001', // E.164 format
        role: 'admin',
        is_verified: true,
      });

      // Query again to get the seeded accounts
      users = await User.findAll({
        attributes: ['id', 'email', 'full_name', 'role', 'phone', 'is_verified'],
        order: [['createdAt', 'DESC']]
      });
    }

    return NextResponse.json({ success: true, accounts: users });
  } catch (error) {
    console.error('Failed to retrieve live accounts:', error);
    return NextResponse.json({ success: false, accounts: [], error: error.message }, { status: 500 });
  }
}

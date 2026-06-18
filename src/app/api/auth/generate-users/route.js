import { NextResponse } from 'next/server';
import { User } from '@/db/models/User.js';
import { Doctor } from '@/db/models/Doctor.js';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const randomSuffix = crypto.randomBytes(3).toString('hex');
    
    // 1. Create Patient
    const patientEmail = `patient_${randomSuffix}@emergency360.com`;
    const patient = await User.create({
      email: patientEmail,
      password: 'password123',
      full_name: `Test Patient (${randomSuffix.toUpperCase()})`,
      phone: `+23470${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: 'patient',
      is_verified: true,
    });

    // 2. Create Doctor User
    const doctorEmail = `doctor_${randomSuffix}@emergency360.com`;
    const doctorUser = await User.create({
      email: doctorEmail,
      password: 'password123',
      full_name: `Dr. Tester (${randomSuffix.toUpperCase()})`,
      phone: `+23480${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: 'doctor',
      is_verified: true,
    });
    
    // Create Associated Doctor Profile
    await Doctor.create({
      userId: doctorUser.id,
      specialization: 'Emergency Medicine',
      yearsOfExperience: 5 + Math.floor(Math.random() * 15),
      hospitalName: 'General Hospital',
      verificationStatus: 'Verified',
      registrationFeePaid: true,
    });

    // 3. Create Dispatcher User
    const dispatcherEmail = `dispatcher_${randomSuffix}@emergency360.com`;
    const dispatcher = await User.create({
      email: dispatcherEmail,
      password: 'password123',
      full_name: `Dispatcher (${randomSuffix.toUpperCase()})`,
      phone: `+23490${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: 'dispatcher',
      is_verified: true,
    });

    console.log(`Generated fresh test accounts with suffix ${randomSuffix}`);

    return NextResponse.json({
      success: true,
      message: `Successfully generated test accounts with suffix ${randomSuffix.toUpperCase()}!`,
      accounts: [
        { email: patientEmail, role: 'patient', fullName: patient.full_name },
        { email: doctorEmail, role: 'doctor', fullName: doctorUser.full_name },
        { email: dispatcherEmail, role: 'dispatcher', fullName: dispatcher.full_name }
      ]
    });
  } catch (error) {
    console.error('Failed to generate test users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { User } from '@/db/models/User.js';
import { Doctor } from '@/db/models/Doctor.js';
import { sendVerificationEmail } from '@/server/utils/sendEmail.js';
import { logActivity } from '@/server/utils/auditLogger.js';

export async function POST(req) {
  try {
    const { email, password, full_name, phone, role } = await req.json();
    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Email, password, and name are required.' }, { status: 400 });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ where: { email: trimmedEmail } });
    if (userExists) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const userRole = role || 'patient';
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      email: trimmedEmail,
      password,
      full_name,
      phone: phone || '',
      role: userRole,
      is_verified: false,
      verificationToken,
      verificationTokenExpires,
    });

    if (userRole === 'doctor') {
      await Doctor.create({
        userId: user.id,
        specialization: 'General Practice',
        hospitalName: 'Independent',
      });
    }

    try {
      await sendVerificationEmail(user.email, verificationToken, user.full_name);
    } catch (emailErr) {
      console.error('Failed to send verification email on register:', emailErr);
    }

    await logActivity('USER_REGISTER', user.id, { email: user.email, role: user.role }, req);

    return NextResponse.json({
      message: 'Registration successful! A verification link has been sent to your email. Please check your inbox.',
      record: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_verified: false
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Server error during registration' }, { status: 500 });
  }
}

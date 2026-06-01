import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '@/db/models/User.js';
import { Doctor } from '@/db/models/Doctor.js';
import { logActivity } from '@/server/utils/auditLogger.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const trimmedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ 
      where: { email: trimmedEmail, role: 'doctor' },
      include: [{ model: Doctor, as: 'doctor' }]
    });

    if (!user || !(await user.matchPassword(password))) {
      await logActivity('LOGIN_FAILED', null, { email: trimmedEmail, role: 'doctor', reason: 'Invalid doctor credentials' }, req);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (!user.is_verified) {
      await logActivity('LOGIN_FAILED', user.id, { email: user.email, role: 'doctor', reason: 'Doctor email not verified' }, req);
      return NextResponse.json({ error: 'Please verify your email address before logging in.' }, { status: 403 });
    }

    const token = generateToken(user.id, user.role);
    const userObject = user.toJSON();
    delete userObject.password;

    await logActivity('LOGIN_SUCCESS', user.id, { email: user.email, role: 'doctor' }, req);
    return NextResponse.json({ token, record: userObject });
  } catch (error) {
    console.error('Doctor login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

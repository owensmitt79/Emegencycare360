import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '@/db/models/User.js';
import { logActivity } from '@/server/utils/auditLogger.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: trimmedEmail } });
    if (!user) {
      await logActivity('LOGIN_FAILED', null, { email: trimmedEmail, reason: 'User not found' }, req);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await logActivity('LOGIN_FAILED', user.id, { email: user.email, reason: 'Incorrect password' }, req);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (!user.is_verified) {
      await logActivity('LOGIN_FAILED', user.id, { email: user.email, reason: 'Email not verified' }, req);
      return NextResponse.json({ error: 'Please verify your email address before logging in.' }, { status: 403 });
    }

    const token = generateToken(user.id, user.role);
    const userObject = user.toJSON();
    delete userObject.password;

    await logActivity('LOGIN_SUCCESS', user.id, { email: user.email, role: user.role }, req);
    return NextResponse.json({ token, record: userObject });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error during login' }, { status: 500 });
  }
}

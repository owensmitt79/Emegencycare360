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
    const trimmedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ where: { email: trimmedEmail, role: 'admin' } });
    if (!user || !(await user.matchPassword(password))) {
      await logActivity('LOGIN_FAILED', null, { email: trimmedEmail, role: 'admin', reason: 'Invalid admin credentials' }, req);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = generateToken(user.id, user.role);
    const userObject = user.toJSON();
    delete userObject.password;

    await logActivity('LOGIN_SUCCESS', user.id, { email: user.email, role: 'admin' }, req);
    return NextResponse.json({ token, record: userObject });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

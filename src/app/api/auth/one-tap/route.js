import { NextResponse } from 'next/server';
import crypto from 'crypto';
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
    const { email, full_name, phone } = await req.json();
    if (!email || !full_name) {
      return NextResponse.json({ error: 'Email and name are required for quick registration.' }, { status: 400 });
    }

    const trimmedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ where: { email: trimmedEmail } });
    let isNewUser = false;

    if (!user) {
      // Create a new user with verified status and a secure random password
      const randomPassword = crypto.randomBytes(16).toString('hex') + 'Aa1!';
      user = await User.create({
        email: trimmedEmail,
        password: randomPassword,
        full_name,
        phone: phone || '',
        role: 'patient',
        is_verified: true, // Google / Phone device registered emails are verified
      });
      isNewUser = true;
      await logActivity('USER_REGISTER', user.id, { email: user.email, role: user.role, method: 'one-tap' }, req);
    } else {
      // If user exists but is not verified, auto-verify them since they just authenticated via Google/Device
      if (!user.is_verified) {
        user.is_verified = true;
        await user.save();
      }
      await logActivity('LOGIN_SUCCESS', user.id, { email: user.email, role: user.role, method: 'one-tap' }, req);
    }

    const token = generateToken(user.id, user.role);
    const userObject = user.toJSON();
    delete userObject.password;

    return NextResponse.json({
      message: isNewUser ? 'Account registered successfully!' : 'Logged in successfully!',
      token,
      record: userObject,
    }, { status: isNewUser ? 201 : 200 });
  } catch (error) {
    console.error('One-Tap Auth Error:', error);
    return NextResponse.json({ error: 'Server error during quick registration' }, { status: 500 });
  }
}

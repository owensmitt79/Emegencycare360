import { NextResponse } from 'next/server';
import { User } from '@/db/models/User.js';
import { logActivity } from '@/server/utils/auditLogger.js';

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'Verification token is required.' }, { status: 400 });
    }

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired verification token.' }, { status: 400 });
    }

    if (user.verificationTokenExpires && new Date() > new Date(user.verificationTokenExpires)) {
      return NextResponse.json({ error: 'Verification token has expired.' }, { status: 400 });
    }

    user.is_verified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    await logActivity('EMAIL_VERIFIED', user.id, { email: user.email }, req);

    return NextResponse.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: 'Server error during email verification' }, { status: 500 });
  }
}

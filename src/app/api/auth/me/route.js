import { NextResponse } from 'next/server';
import { getAuthUser } from '@/server/utils/auth.js';
import { Doctor } from '@/db/models/Doctor.js';
import { User } from '@/db/models/User.js';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Not authorized, invalid token.' }, { status: 401 });
    }

    // Eager load Doctor relation to match Express /me route
    const fullUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Doctor, as: 'doctor' }]
    });

    return NextResponse.json({ record: fullUser });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

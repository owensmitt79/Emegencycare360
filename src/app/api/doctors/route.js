import { NextResponse } from 'next/server';
import { getAuthUser, hasRole } from '@/server/utils/auth.js';
import { Doctor } from '@/db/models/Doctor.js';
import { User } from '@/db/models/User.js';
import { logActivity } from '@/server/utils/auditLogger.js';

export async function GET(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const doctors = await Doctor.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name', 'email', 'phone']
      }]
    });
    
    const mappedDoctors = doctors.map(d => {
      const doc = d.toJSON();
      if (doc.user) {
        doc.fullName = doc.user.full_name;
        doc.email = doc.user.email;
      }
      return doc;
    });

    return NextResponse.json({ items: mappedDoctors });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !hasRole(authUser, ['admin'])) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await req.json();
    const { user, userId, ...rest } = body;
    const targetUserId = user || userId;

    const newDoc = await Doctor.create({
      ...rest,
      userId: targetUserId
    });
    await logActivity('CREATE_DOCTOR_PROFILE', authUser.id, { doctorId: newDoc.id, targetUserId }, req);
    return NextResponse.json(newDoc, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/server/utils/auth.js';
import { Doctor } from '@/db/models/Doctor.js';
import { User } from '@/db/models/User.js';

export async function GET(req, { params }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { id } = params;
    const doctor = await Doctor.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name', 'email', 'phone']
      }]
    });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    
    const doc = doctor.toJSON();
    if (doc.user) {
      doc.fullName = doc.user.full_name;
      doc.email = doc.user.email;
    }
    return NextResponse.json(doc);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

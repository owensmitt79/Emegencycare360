import { NextResponse } from 'next/server';
import { getAuthUser } from '@/server/utils/auth.js';
import { User } from '@/db/models/User.js';
import { logActivity } from '@/server/utils/auditLogger.js';

export async function PATCH(req, { params }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { id } = params;
    if (authUser.role !== 'admin' && authUser.id !== id) {
      await logActivity('UNAUTHORIZED_ACCESS_ATTEMPT', authUser.id, { targetUserId: id, action: 'update_user' }, req);
      return NextResponse.json({ error: 'Not authorized to modify this profile.' }, { status: 403 });
    }

    const updated = await User.findByPk(id);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const phiFields = ['blood_type', 'allergies', 'medications', 'emergency_contacts'];
    const isModifyingPhi = phiFields.some(field => body[field] !== undefined);

    await updated.update(body);

    if (isModifyingPhi) {
      await logActivity('UPDATE_PHI', authUser.id, { targetUserId: updated.id, fieldsChanged: Object.keys(body).filter(k => phiFields.includes(k)) }, req);
    } else {
      await logActivity('UPDATE_USER_PROFILE', authUser.id, { targetUserId: updated.id }, req);
    }

    const userJson = updated.toJSON();
    delete userJson.password;
    return NextResponse.json(userJson);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

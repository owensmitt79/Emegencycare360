import { NextResponse } from 'next/server';
import { getAuthUser, hasRole } from '@/server/utils/auth.js';
import { PartnerHospital } from '@/db/models/OtherModels.js';
import { logActivity } from '@/server/utils/auditLogger.js';

export async function PATCH(req, { params }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !hasRole(authUser, ['admin', 'dispatcher'])) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { id } = params;
    const updated = await PartnerHospital.findByPk(id);
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    await updated.update(body);
    await logActivity('UPDATE_PARTNER_HOSPITAL', authUser.id, { hospitalId: updated.id }, req);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

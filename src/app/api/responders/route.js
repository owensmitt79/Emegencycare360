import { NextResponse } from 'next/server';
import { getAuthUser, hasRole } from '@/server/utils/auth.js';
import { Responder } from '@/db/models/OtherModels.js';

export async function GET(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !hasRole(authUser, ['admin', 'dispatcher'])) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const items = await Responder.findAll();
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

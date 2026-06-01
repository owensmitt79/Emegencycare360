import { NextResponse } from 'next/server';
import { getAuthUser } from '@/server/utils/auth.js';
import { EmergencyRequest } from '@/db/models/EmergencyRequest.js';
import { User } from '@/db/models/User.js';
import { logActivity } from '@/server/utils/auditLogger.js';

export async function GET(req, { params }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { id } = params;
    const reqItem = await EmergencyRequest.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });
    if (!reqItem) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (authUser.role === 'patient' && reqItem.userId !== authUser.id) {
      await logActivity('UNAUTHORIZED_ACCESS_ATTEMPT', authUser.id, { emergencyRequestId: id, action: 'read' }, req);
      return NextResponse.json({ error: 'Not authorized to view this emergency request.' }, { status: 403 });
    }

    await logActivity('READ_EMERGENCY_DETAILS', authUser.id, { emergencyRequestId: id }, req);
    return NextResponse.json(reqItem);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { id } = params;
    const record = await EmergencyRequest.findByPk(id);
    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (authUser.role === 'patient' && record.userId !== authUser.id) {
      await logActivity('UNAUTHORIZED_ACCESS_ATTEMPT', authUser.id, { emergencyRequestId: id, action: 'modify' }, req);
      return NextResponse.json({ error: 'Not authorized to modify this emergency request.' }, { status: 403 });
    }

    const body = await req.json();
    const { user, userId, user_id, ...rest } = body;
    const targetUserId = user || userId || user_id;

    const updateData = { ...rest };
    if (targetUserId && authUser.role !== 'patient') {
      updateData.userId = targetUserId;
    }

    const oldStatus = record.status;
    await record.update(updateData);

    const details = { emergencyRequestId: record.id };
    if (updateData.status && updateData.status !== oldStatus) {
      details.statusChange = `${oldStatus} -> ${updateData.status}`;
    }
    if (updateData.assigned_responder_id || updateData.assigned_ambulance_id) {
      details.assignments = {
        responder: updateData.assigned_responder_id || record.assigned_responder_id,
        ambulance: updateData.assigned_ambulance_id || record.assigned_ambulance_id,
      };
    }

    await logActivity('UPDATE_EMERGENCY', authUser.id, details, req);
    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

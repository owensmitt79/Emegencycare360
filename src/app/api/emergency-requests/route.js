import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { getAuthUser } from '@/server/utils/auth.js';
import { EmergencyRequest } from '@/db/models/EmergencyRequest.js';
import { User } from '@/db/models/User.js';
import { logActivity } from '@/server/utils/auditLogger.js';

export async function GET(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const userQuery = searchParams.get('user');

    let whereClause = {};
    if (status === 'active') {
      whereClause.status = { [Op.notIn]: ['completed', 'cancelled'] };
    } else if (status) {
      whereClause.status = status;
    }

    if (authUser.role === 'patient') {
      whereClause.userId = authUser.id;
    } else if (userQuery) {
      whereClause.userId = userQuery;
    }

    const results = await EmergencyRequest.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name', 'email', 'phone']
      }]
    });

    await logActivity('READ_EMERGENCY_LIST', authUser.id, { count: results.length, filter: status }, req);
    return NextResponse.json({ items: results });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    const { user, userId, user_id, ...rest } = body;
    const targetUserId = authUser.role === 'patient' ? authUser.id : (user || userId || user_id || authUser.id);

    const newReq = await EmergencyRequest.create({
      ...rest,
      userId: targetUserId,
      status: 'pending'
    });

    await logActivity('SUBMIT_EMERGENCY', authUser.id, { emergencyRequestId: newReq.id, targetUserId }, req);
    return NextResponse.json(newReq, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

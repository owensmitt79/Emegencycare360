import { NextResponse } from 'next/server';
import { getAuthUser, hasRole } from '@/server/utils/auth.js';
import { Doctor } from '@/db/models/Doctor.js';
import { User } from '@/db/models/User.js';
import { logActivity } from '@/server/utils/auditLogger.js';

export async function POST(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !hasRole(authUser, ['doctor'])) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const doctor = await Doctor.findOne({ where: { userId: authUser.id } });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found.' }, { status: 404 });
    }

    let plan = 'basic';
    try {
      const body = await req.json();
      if (body && body.plan) {
        plan = body.plan;
      }
    } catch (e) {
      // fallback to basic if no JSON body or parsing fails
    }

    if (!['basic', 'monthly', 'annual', 'lifetime'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid subscription plan choice.' }, { status: 400 });
    }

    let amount = 5000;
    let expiresAt = null;
    let baseDate = Date.now();

    // If extending the same plan and it is not expired, extend from the current expiration date
    if (doctor.subscriptionPlan === plan && doctor.subscriptionExpiresAt && new Date(doctor.subscriptionExpiresAt) > new Date()) {
      baseDate = new Date(doctor.subscriptionExpiresAt).getTime();
    }

    if (plan === 'monthly') {
      amount = 10000;
      expiresAt = new Date(baseDate + 30 * 24 * 60 * 60 * 1000);
    } else if (plan === 'annual') {
      amount = 80000;
      expiresAt = new Date(baseDate + 365 * 24 * 60 * 60 * 1000);
    } else if (plan === 'lifetime') {
      amount = 150000;
      expiresAt = null;
    } else {
      amount = 5000;
      expiresAt = null;
    }

    doctor.registrationFeePaid = true;
    doctor.subscriptionPlan = plan;
    doctor.subscriptionExpiresAt = expiresAt;
    await doctor.save();

    await logActivity('DOCTOR_SUBSCRIPTION_PURCHASE_SUCCESS', authUser.id, { plan, amount, currency: 'NGN' }, req);

    const updatedUser = await User.findByPk(authUser.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Doctor, as: 'doctor' }]
    });

    return NextResponse.json({
      message: `Plan '${plan}' activated successfully for ₦${amount.toLocaleString()}.`,
      record: updatedUser
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

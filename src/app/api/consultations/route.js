import { NextResponse } from 'next/server';
import { getAuthUser } from '@/server/utils/auth.js';
import { Consultation } from '@/db/models/OtherModels.js';
import { logActivity } from '@/server/utils/auditLogger.js';

export async function POST(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    const { patient, doctor, ...rest } = body;
    
    const newConsultation = await Consultation.create({
      ...rest,
      patientId: patient,
      doctorId: doctor,
      status: 'Pending',
      consultationDate: new Date()
    });

    await logActivity('CREATE_CONSULTATION', authUser.id, { consultationId: newConsultation.id, patientId: patient, doctorId: doctor }, req);
    return NextResponse.json(newConsultation, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/server/utils/auth.js';
import { Message } from '@/db/models/OtherModels.js';

export async function GET(req, { params }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { roomId } = params;
    const msgs = await Message.findAll({
      where: { roomId },
      order: [['createdAt', 'ASC']]
    });
    return NextResponse.json({ items: msgs });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { roomId } = params;
    const body = await req.json();
    const msg = await Message.create({
      roomId,
      sender: body.sender,
      senderName: body.senderName,
      text: body.text,
    });
    return NextResponse.json(msg, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

import fs from 'fs';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = 'C:\\Users\\user_pc\\.gemini\\antigravity-ide\\brain\\ae6f7144-30d2-4f09-b4cc-6155832ab582\\media__1781194329068.png';
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Failed to read logo image:', error);
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}

import fs from 'fs';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = 'C:\\Users\\user_pc\\.gemini\\antigravity-ide\\brain\\54e2199f-d4ce-452e-b03b-cad8eb474413\\medical_hero_image_1780311578400.png';
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Failed to read hero image:', error);
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}

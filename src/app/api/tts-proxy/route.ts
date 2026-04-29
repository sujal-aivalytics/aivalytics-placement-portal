// POST /api/tts-proxy
// Body: { text: string, voice?: string, speed?: number }
// Returns: audio/mpeg binary stream

import { NextRequest, NextResponse } from 'next/server';

const KOKORO_URL = process.env.KOKORO_TTS_URL ?? 'http://localhost:3001';

export async function POST(req: NextRequest) {
  const { text, voice = 'af_heart', speed = 0.93 } = await req.json();

  try {
    const upstream = await fetch(`${KOKORO_URL}/api/v1/audio/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'model_q8f16', voice, input: text, speed }),
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'TTS upstream error' }, { status: 502 });
    }

    const audioBuffer = await upstream.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Kokoro TTS unreachable' }, { status: 503 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300; // 5 minutes

export async function GET(req: NextRequest) {
    return NextResponse.json({ success: false, message: "Migration API is disabled" }, { status: 400 });
}

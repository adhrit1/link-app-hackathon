import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { item_id, claim_contact } = body;
  if (!item_id || !claim_contact) {
    return NextResponse.json({ error: 'Missing item_id or claim_contact' }, { status: 400 });
  }
  const res = await fetch(`${BACKEND_URL}/api/lostfound/${item_id}/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim_contact }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 
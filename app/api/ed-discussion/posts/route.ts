import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET() {
  try {
    // Fetch real data from backend API
    const response = await fetch(`${BACKEND_URL}/api/ed-discussion/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Ed Discussion posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Ed Discussion posts from backend' },
      { status: 500 }
    );
  }
} 
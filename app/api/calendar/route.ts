import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  try {
    // Fetch REAL calendar data from backend API
    const response = await fetch(`${BACKEND_URL}/api/calendar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform backend data to frontend format if needed
    const events = data.events || data;
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json(
      { error: 'Failed to load calendar data' },
      { status: 500 }
    );
  }
} 
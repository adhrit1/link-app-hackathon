import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module: moduleName } = await params;
    
    // Fetch real data from backend API
    const response = await fetch(`${BACKEND_URL}/api/modules/${moduleName}`, {
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
    console.error('Error fetching module data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module data from backend' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module: moduleName } = await params;
    const body = await request.json();
    
    // Send data to backend API
    const response = await fetch(`${BACKEND_URL}/api/modules/${moduleName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting module data:', error);
    return NextResponse.json(
      { error: 'Failed to submit module data to backend' },
      { status: 500 }
    );
  }
} 
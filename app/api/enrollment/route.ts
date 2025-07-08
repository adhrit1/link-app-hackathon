import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  try {
    // Get enrollment questions from backend
    const response = await fetch(`${BACKEND_URL}/api/module/enrollment/questions`, {
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
    console.error('Error fetching enrollment data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollment data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Submit initial questions to backend
    const response = await fetch(`${BACKEND_URL}/api/submit_initial_questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        module: 'enrollment',
        responses: body.responses
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting enrollment questions:', error);
    return NextResponse.json(
      { error: 'Failed to submit enrollment questions' },
      { status: 500 }
    );
  }
} 
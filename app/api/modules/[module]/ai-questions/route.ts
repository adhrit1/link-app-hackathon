import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function POST(
  request: NextRequest,
  { params }: { params: { module: string } }
) {
  try {
    const moduleName = params.module;
    const body = await request.json();
    
    // Submit AI questions to backend
    const response = await fetch(`${BACKEND_URL}/api/submit_ai_questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        module: moduleName,
        responses: body.responses
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting AI questions:', error);
    return NextResponse.json(
      { error: 'Failed to submit AI questions' },
      { status: 500 }
    );
  }
} 
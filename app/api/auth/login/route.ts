import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // For now, we'll create a simple user object since the Flask backend doesn't have password auth
    // In a real implementation, you'd validate against the Flask backend
    const user = {
      id: 1,
      email: email,
      student_type: 'freshman',
      user_metadata: {
        name: email.split('@')[0] // Use email prefix as name
      }
    };

    // Set a session cookie
    const response = NextResponse.json({ user });
    response.cookies.set('session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
} 
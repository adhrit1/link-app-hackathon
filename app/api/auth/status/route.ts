import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (sessionCookie && sessionCookie.value === 'authenticated') {
      // Return a mock user for now
      // In a real implementation, you'd validate the session with the Flask backend
      const user = {
        id: 1,
        email: 'user@example.com',
        student_type: 'freshman',
        user_metadata: {
          name: 'User'
        }
      };
      
      return NextResponse.json({ user });
    } else {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json(
      { user: null },
      { status: 500 }
    );
  }
} 
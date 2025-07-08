import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  try {
    // Proxy the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/user/home-data`, {
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
    console.error('Error fetching home data:', error);
    
    // Return fallback data if backend is not available
    return NextResponse.json({
      success: true,
      user: {
        name: 'Demo User',
        email: 'demo@berkeley.edu',
        student_type: 'freshman'
      },
      modules: {
        completed: ['enrollment', 'dorm'],
        in_progress: ['job'],
        available: ['community', 'academic-support', 'health', 'safety', 'grades']
      }
    });
  }
} 
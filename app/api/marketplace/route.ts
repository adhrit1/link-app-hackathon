import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET() {
  try {
    // Get real marketplace data from backend
    const response = await fetch(`${BACKEND_URL}/api/marketplace/enhanced-data`);
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      // If enhanced data is not available, try the regular marketplace endpoint
      const fallbackResponse = await fetch(`${BACKEND_URL}/api/marketplace`);
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return NextResponse.json(fallbackData);
      }
      
      // If no data is available, return empty array
      return NextResponse.json({
        items: [],
        total: 0,
        message: 'No marketplace data available. Please run the scraper first.'
      });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching marketplace data:', error);
    return NextResponse.json({
      items: [],
      total: 0,
      error: 'Failed to fetch marketplace data'
    }, { status: 500 });
  }
} 
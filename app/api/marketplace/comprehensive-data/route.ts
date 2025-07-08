import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  try {
    // Get comprehensive marketplace data from backend
    const response = await fetch(`${BACKEND_URL}/api/marketplace/comprehensive-data`);
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      // If comprehensive data is not available, try the enhanced data endpoint
      const enhancedResponse = await fetch(`${BACKEND_URL}/api/marketplace/enhanced-data`);
      if (enhancedResponse.ok) {
        const enhancedData = await enhancedResponse.json();
        return NextResponse.json(enhancedData);
      }
      
      // If no data is available, return empty array
      return NextResponse.json({
        items: [],
        total: 0,
        message: 'No marketplace data available. Please run the comprehensive scraper first.'
      });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching comprehensive marketplace data:', error);
    return NextResponse.json({
      items: [],
      total: 0,
      error: 'Failed to fetch comprehensive marketplace data'
    }, { status: 500 });
  }
} 
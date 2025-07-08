import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const q = searchParams.get('q');
  const type = searchParams.get('type'); // lost, found, or all
  
  let url = `${BACKEND_URL}/api/lostfound`;
  const params = new URLSearchParams();
  
  if (q) {
    url = `${BACKEND_URL}/api/lostfound/search`;
    params.append('q', q);
  } else {
    if (status) {
      params.append('status', status);
    }
    if (type && type !== 'all') {
      params.append('type', type);
    }
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Transform data to match frontend expectations
    const transformedItems = data.map((item: any) => ({
      id: item.id.toString(),
      type: item.status === 'lost' ? 'lost' : 'found',
      title: item.title,
      description: item.description,
      category: _categorizeItem(item.title, item.description),
      location: item.location,
      date: item.date_reported || item.date_lost,
      contact: {
        name: item.reporter_contact,
        email: item.reporter_contact,
        phone: null
      },
      images: item.image_url ? [item.image_url] : [],
      status: item.status === 'claimed' ? 'resolved' : 'active',
      tags: _extractTags(item.title, item.description),
      reward: null,
      isVerified: true
    }));
    
    return NextResponse.json({
      items: transformedItems,
      total: transformedItems.length
    });
    
  } catch (error) {
    console.error('Error fetching lost & found data:', error);
    return NextResponse.json({
      items: [],
      total: 0,
      error: 'Failed to fetch lost & found data'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Transform frontend data to backend format
    const backendData = {
      title: body.title,
      description: body.description,
      location: body.location,
      date_lost: body.date,
      reporter_contact: body.contact.email,
      image_url: body.images?.[0] || null,
      status: body.type || 'lost'
    };
    
    const res = await fetch(`${BACKEND_URL}/api/lostfound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
    });
    
    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
    
  } catch (error) {
    console.error('Error creating lost & found item:', error);
    return NextResponse.json({
      error: 'Failed to create lost & found item'
    }, { status: 500 });
  }
}

// Helper functions for AI-powered categorization and tagging
function _categorizeItem(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('phone') || text.includes('iphone') || text.includes('android') || text.includes('samsung')) {
    return 'Electronics';
  } else if (text.includes('laptop') || text.includes('computer') || text.includes('macbook')) {
    return 'Electronics';
  } else if (text.includes('wallet') || text.includes('purse') || text.includes('bag') || text.includes('backpack')) {
    return 'Personal Items';
  } else if (text.includes('key') || text.includes('card') || text.includes('id')) {
    return 'Personal Items';
  } else if (text.includes('book') || text.includes('textbook') || text.includes('notebook')) {
    return 'Academic';
  } else if (text.includes('clothing') || text.includes('shirt') || text.includes('jacket') || text.includes('hoodie')) {
    return 'Clothing';
  } else if (text.includes('jewelry') || text.includes('ring') || text.includes('necklace') || text.includes('watch')) {
    return 'Jewelry';
  } else {
    return 'Other';
  }
}

function _extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags = [];
  
  // Extract location tags
  if (text.includes('library') || text.includes('moffitt') || text.includes('doe')) {
    tags.push('Library');
  }
  if (text.includes('rsf') || text.includes('gym') || text.includes('recreation')) {
    tags.push('RSF');
  }
  if (text.includes('dorm') || text.includes('unit') || text.includes('residence')) {
    tags.push('Dorm');
  }
  if (text.includes('campus') || text.includes('berkeley')) {
    tags.push('Campus');
  }
  
  // Extract item type tags
  if (text.includes('phone') || text.includes('iphone')) {
    tags.push('Phone');
  }
  if (text.includes('laptop') || text.includes('computer')) {
    tags.push('Laptop');
  }
  if (text.includes('wallet') || text.includes('purse')) {
    tags.push('Wallet');
  }
  if (text.includes('key')) {
    tags.push('Keys');
  }
  if (text.includes('book') || text.includes('textbook')) {
    tags.push('Book');
  }
  
  return tags;
} 
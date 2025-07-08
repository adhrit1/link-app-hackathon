import { NextResponse } from 'next/server';

export async function GET() {
  // Mock lost & found data to prevent 404 errors
  const mockData = {
    items: [
      {
        id: "1",
        title: "Lost: Blue Backpack",
        description: "Lost my blue Jansport backpack near Sather Gate. Has my laptop and textbooks inside.",
        type: "lost",
        category: "Backpack",
        location: "Sather Gate",
        contact: "student@berkeley.edu",
        createdAt: "2025-07-08T12:00:00Z",
        reward: "$50"
      },
      {
        id: "2",
        title: "Found: Silver MacBook",
        description: "Found a silver MacBook Pro in the library. Please contact with serial number to claim.",
        type: "found",
        category: "Electronics",
        location: "Moffitt Library",
        contact: "library@berkeley.edu",
        createdAt: "2025-07-08T11:30:00Z",
        reward: "None"
      },
      {
        id: "3",
        title: "Lost: Gold Necklace",
        description: "Lost my grandmother's gold necklace near the Campanile. Very sentimental value.",
        type: "lost",
        category: "Jewelry",
        location: "Campanile",
        contact: "student2@berkeley.edu",
        createdAt: "2025-07-08T11:00:00Z",
        reward: "$200"
      },
      {
        id: "4",
        title: "Found: Student ID Card",
        description: "Found a student ID card for John Smith. Please contact to return.",
        type: "found",
        category: "ID Card",
        location: "Sproul Plaza",
        contact: "security@berkeley.edu",
        createdAt: "2025-07-08T10:45:00Z",
        reward: "None"
      }
    ],
    total: 4
  };

  return NextResponse.json(mockData);
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
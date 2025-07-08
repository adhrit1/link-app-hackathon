import { NextResponse } from 'next/server';

export async function GET() {
  // Mock enhanced marketplace data to prevent 404 errors
  const mockData = {
    items: [
      {
        id: "1",
        title: "iPhone 14 Pro",
        description: "256GB, Space Black. Perfect condition with original box and accessories.",
        price: 800,
        category: "Electronics",
        seller: {
          name: "Tech Student",
          rating: 4.9,
          isVerified: true,
          isStudent: true,
        },
        condition: "Excellent",
        images: ["/iphone.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T11:00:00Z"
      },
      {
        id: "2",
        title: "Psychology Textbook Bundle",
        description: "PSYCH 1, 2, and 3 textbooks with study guides and notes.",
        price: 60,
        category: "Books",
        seller: {
          name: "Psych Major",
          rating: 4.8,
          isVerified: true,
          isStudent: true,
        },
        condition: "Good",
        images: ["/psych.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T10:45:00Z"
      },
      {
        id: "3",
        title: "Mini Fridge",
        description: "Perfect for dorm room. Holds drinks and snacks.",
        price: 50,
        category: "Appliances",
        seller: {
          name: "Dorm Resident",
          rating: 4.7,
          isVerified: true,
          isStudent: true,
        },
        condition: "Good",
        images: ["/fridge.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T10:30:00Z"
      }
    ],
    total: 3,
    categories: ["Electronics", "Books", "Appliances"]
  };

  return NextResponse.json(mockData);
} 
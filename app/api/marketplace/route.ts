import { NextResponse } from 'next/server';

export async function GET() {
  // Mock marketplace data to prevent 404 errors
  const mockData = {
    items: [
      {
        id: "1",
        title: "Gaming Laptop",
        description: "ASUS ROG gaming laptop. Great for gaming and coding.",
        price: 900,
        category: "Electronics",
        seller: {
          name: "Gamer Student",
          rating: 4.8,
          isVerified: true,
          isStudent: true,
        },
        condition: "Good",
        images: ["/gaming-laptop.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T13:00:00Z"
      },
      {
        id: "2",
        title: "Chemistry Lab Kit",
        description: "Complete chemistry lab kit with safety equipment.",
        price: 75,
        category: "Lab Equipment",
        seller: {
          name: "Chem Major",
          rating: 4.9,
          isVerified: true,
          isStudent: true,
        },
        condition: "Excellent",
        images: ["/chem-kit.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T12:45:00Z"
      }
    ],
    total: 2,
    categories: ["Electronics", "Lab Equipment"]
  };

  return NextResponse.json(mockData);
} 
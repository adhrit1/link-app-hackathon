import { NextResponse } from 'next/server';

export async function GET() {
  // Mock marketplace data to prevent 404 errors
  const mockData = {
    items: [
      {
        id: "1",
        title: "MacBook Pro 2023",
        description: "Excellent condition, barely used. Perfect for coding and design work.",
        price: 1200,
        category: "Electronics",
        seller: {
          name: "CS Student",
          rating: 4.8,
          isVerified: true,
          isStudent: true,
        },
        condition: "Like New",
        images: ["/macbook.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T10:00:00Z"
      },
      {
        id: "2",
        title: "Calculus Textbook Set",
        description: "Complete set of Math 1A and 1B textbooks with practice problems.",
        price: 45,
        category: "Books",
        seller: {
          name: "Math Major",
          rating: 4.9,
          isVerified: true,
          isStudent: true,
        },
        condition: "Good",
        images: ["/calculus.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T09:30:00Z"
      },
      {
        id: "3",
        title: "Bike Lock & Helmet",
        description: "Kryptonite lock and Bell helmet. Great for campus commuting.",
        price: 25,
        category: "Transportation",
        seller: {
          name: "Bike Enthusiast",
          rating: 4.7,
          isVerified: true,
          isStudent: true,
        },
        condition: "Good",
        images: ["/bike.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T09:00:00Z"
      },
      {
        id: "4",
        title: "Coffee Maker",
        description: "Keurig coffee maker with 20+ pods. Perfect for late night study sessions.",
        price: 35,
        category: "Appliances",
        seller: {
          name: "Coffee Lover",
          rating: 4.6,
          isVerified: true,
          isStudent: true,
        },
        condition: "Good",
        images: ["/coffee.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T08:45:00Z"
      },
      {
        id: "5",
        title: "Desk Lamp",
        description: "LED desk lamp with adjustable brightness. Great for studying.",
        price: 15,
        category: "Furniture",
        seller: {
          name: "Study Buddy",
          rating: 4.5,
          isVerified: true,
          isStudent: true,
        },
        condition: "Like New",
        images: ["/lamp.jpg"],
        location: "UC Berkeley Campus",
        createdAt: "2025-07-08T08:30:00Z"
      }
    ],
    total: 5,
    categories: ["Electronics", "Books", "Transportation", "Appliances", "Furniture"]
  };

  return NextResponse.json(mockData);
} 
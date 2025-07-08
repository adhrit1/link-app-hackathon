import { NextResponse } from 'next/server';

export async function POST() {
  // Simulate scraping data from multiple sources
  const scrapedData = {
    success: true,
    sources_scraped: ["facebook", "craigslist", "berkeley_student_groups"],
    items_found: 15,
    new_items: 8,
    processing_time: "2.3s",
    data: [
      {
        id: "scraped_1",
        title: "Calculus Textbook",
        price: 45,
        source: "facebook",
        url: "https://facebook.com/marketplace/item/123",
        scraped_at: "2024-01-10T10:30:00Z"
      },
      {
        id: "scraped_2", 
        title: "Mini Fridge",
        price: 80,
        source: "craigslist",
        url: "https://sfbay.craigslist.org/ber/for/123",
        scraped_at: "2024-01-10T10:30:00Z"
      }
    ]
  };

  return NextResponse.json(scrapedData);
} 
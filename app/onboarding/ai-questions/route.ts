import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await request.json();
  const recommendations = [
    {
      id: 'unit1',
      title: 'Unit 1 - Blackwell Hall',
      description: 'Modern dorm with central location and great social scene.',
      pros: ['Close to classes', 'Updated facilities', 'Active community'],
      cons: ['Higher cost', 'Can be noisy'],
      reddit_posts: [
        { title: 'Is Blackwell worth the price?', upvotes: 42, comments: 8 },
        { title: 'My experience living in Unit 1', upvotes: 30, comments: 5 }
      ]
    },
    {
      id: 'foothill',
      title: 'Foothill',
      description: 'Quiet dorm near engineering with beautiful views.',
      pros: ['Quiet environment', 'Near engineering buildings'],
      cons: ['Far from central campus', 'Limited dining options'],
      reddit_posts: [
        { title: 'Foothill vs Unit 2?', upvotes: 25, comments: 4 }
      ]
    },
    {
      id: 'clark_kerr',
      title: 'Clark Kerr Campus',
      description: 'Large complex with its own dining and strong community.',
      pros: ['Lots of green space', 'Tight-knit community'],
      cons: ['Long walk to main campus'],
      reddit_posts: [
        { title: 'Clark Kerr advice for freshmen', upvotes: 37, comments: 6 }
      ]
    }
  ];
  return NextResponse.json({ recommendations });
}

import { NextRequest, NextResponse } from 'next/server';
import { computeDormScore, getDormPosts, getPros, getCons } from '@/lib/reddit';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const answers: Record<number, string> = {};
  if (body && Array.isArray(body.responses)) {
    for (const r of body.responses) {
      const id = parseInt(r.question_id, 10);
      if (!isNaN(id)) answers[id] = r.answer;
    }
  }
  const recommendations = [
    {
      id: 'unit1',
      title: 'Unit 1',
      description: 'Modern dorm with central location and great social scene.',
      score: computeDormScore('Unit 1', answers),
      walking_time: '8 min walk',
      pros: getPros('Unit 1'),
      cons: getCons('Unit 1'),
      reddit_posts: getDormPosts('Unit 1')
    },
    {
      id: 'unit2',
      title: 'Unit 2',
      description: 'Lively dorm close to campus with a strong social vibe.',
      score: computeDormScore('Unit 2', answers),
      walking_time: '10 min walk',
      pros: getPros('Unit 2'),
      cons: getCons('Unit 2'),
      reddit_posts: getDormPosts('Unit 2'),
    },
    {
      id: 'unit3',
      title: 'Unit 3',
      description: 'Popular southside dorm known for an active community.',
      score: computeDormScore('Unit 3', answers),
      walking_time: '12 min walk',
      pros: getPros('Unit 3'),
      cons: getCons('Unit 3'),
      reddit_posts: getDormPosts('Unit 3'),
    },
    {
      id: 'foothill',
      title: 'Foothill',
      description: 'Quiet dorm near engineering with beautiful views.',
      score: computeDormScore('Foothill', answers),
      walking_time: '18 min walk',
      pros: getPros('Foothill'),
      cons: getCons('Foothill'),
      reddit_posts: getDormPosts('Foothill')
    },
    {
      id: 'clark_kerr',
      title: 'Clark Kerr Campus',
      description: 'Large complex with its own dining and strong community.',
      score: computeDormScore('Clark Kerr', answers),
      walking_time: '15 min walk',
      pros: getPros('Clark Kerr'),
      cons: getCons('Clark Kerr'),
      reddit_posts: getDormPosts('Clark Kerr')
    },
    {
      id: 'blackwell',
      title: 'Blackwell Hall',
      description: 'New high-rise dorm right next to campus and Downtown.',
      score: computeDormScore('Blackwell', answers),
      walking_time: '5 min walk',
      pros: getPros('Blackwell'),
      cons: getCons('Blackwell'),
      reddit_posts: getDormPosts('Blackwell'),
    }
  ];
  return NextResponse.json({ recommendations });
}
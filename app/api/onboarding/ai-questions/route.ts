+123
-61

import { NextRequest, NextResponse } from 'next/server';
import {
  computeDormScore,
  getDormPosts,
  getPros,
  getCons,
  getProsDebug,
  getConsDebug,
  countDormPosts,
} from '@/lib/reddit';

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
    (() => {
      const prosInfo = getProsDebug('Unit 1');
      const consInfo = getConsDebug('Unit 1');
      return {
        id: 'unit1',
        title: 'Unit 1',
        description: 'Modern dorm with central location and great social scene.',
        score: computeDormScore('Unit 1', answers),
        walking_time: '8 min walk',
        pros: prosInfo.keywords,
        cons: consInfo.keywords,
        reddit_posts: getDormPosts('Unit 1'),
        debug: {
          pros_titles: prosInfo.sources,
          cons_titles: consInfo.sources,
          post_count: prosInfo.count,
        },
      };
    })(),
    (() => {
      const prosInfo = getProsDebug('Unit 2');
      const consInfo = getConsDebug('Unit 2');
      return {
        id: 'unit2',
        title: 'Unit 2',
        description: 'Lively dorm close to campus with a strong social vibe.',
        score: computeDormScore('Unit 2', answers),
        walking_time: '10 min walk',
        pros: prosInfo.keywords,
        cons: consInfo.keywords,
        reddit_posts: getDormPosts('Unit 2'),
        debug: {
          pros_titles: prosInfo.sources,
          cons_titles: consInfo.sources,
          post_count: prosInfo.count,
        },
      };
    })(),
    (() => {
      const prosInfo = getProsDebug('Unit 3');
      const consInfo = getConsDebug('Unit 3');
      return {
        id: 'unit3',
        title: 'Unit 3',
        description: 'Popular southside dorm known for an active community.',
        score: computeDormScore('Unit 3', answers),
        walking_time: '12 min walk',
        pros: prosInfo.keywords,
        cons: consInfo.keywords,
        reddit_posts: getDormPosts('Unit 3'),
        debug: {
          pros_titles: prosInfo.sources,
          cons_titles: consInfo.sources,
          post_count: prosInfo.count,
        },
      };
    })(),
    (() => {
      const prosInfo = getProsDebug('Foothill');
      const consInfo = getConsDebug('Foothill');
      return {
        id: 'foothill',
        title: 'Foothill',
        description: 'Quiet dorm near engineering with beautiful views.',
        score: computeDormScore('Foothill', answers),
        walking_time: '18 min walk',
        pros: prosInfo.keywords,
        cons: consInfo.keywords,
        reddit_posts: getDormPosts('Foothill'),
        debug: {
          pros_titles: prosInfo.sources,
          cons_titles: consInfo.sources,
          post_count: prosInfo.count,
        },
      };
    })(),
    (() => {
      const prosInfo = getProsDebug('Clark Kerr');
      const consInfo = getConsDebug('Clark Kerr');
      return {
        id: 'clark_kerr',
        title: 'Clark Kerr Campus',
        description: 'Large complex with its own dining and strong community.',
        score: computeDormScore('Clark Kerr', answers),
        walking_time: '15 min walk',
        pros: prosInfo.keywords,
        cons: consInfo.keywords,
        reddit_posts: getDormPosts('Clark Kerr'),
        debug: {
          pros_titles: prosInfo.sources,
          cons_titles: consInfo.sources,
          post_count: prosInfo.count,
        },
      };
    })(),
    (() => {
      const prosInfo = getProsDebug('Blackwell');
      const consInfo = getConsDebug('Blackwell');
      return {
        id: 'blackwell',
        title: 'Blackwell Hall',
        description: 'New high-rise dorm right next to campus and Downtown.',
        score: computeDormScore('Blackwell', answers),
        walking_time: '5 min walk',
        pros: prosInfo.keywords,
        cons: consInfo.keywords,
        reddit_posts: getDormPosts('Blackwell'),
        debug: {
          pros_titles: prosInfo.sources,
          cons_titles: consInfo.sources,
          post_count: prosInfo.count,
        },
      };
    })()
  ];
  return NextResponse.json({ recommendations });
}
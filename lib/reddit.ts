import fs from 'fs';
import path from 'path';

interface RedditPost {
  title: string;
  content: string;
  score: number;
  url: string;
}

interface RedditData {
  housing: RedditPost[];
}

let cachedData: RedditData | null = null;

function loadRedditData(): RedditData {
  if (!cachedData) {
    const filePath = path.join(process.cwd(), 'app', 'reddit_comprehensive.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    cachedData = JSON.parse(raw) as RedditData;
  }
  return cachedData;
}

interface DormProfile {
  sleep: string;
  social: string;
  noise: string;
}

const DORM_PROFILES: Record<string, DormProfile> = {
  'Unit 1': {
    sleep: 'Night owl',
    social: 'Very social',
    noise: 'Can handle some noise',
  },
  'Unit 2': {
    sleep: 'Night owl',
    social: 'Moderately social',
    noise: 'Noisy environment is fine',
  },
  'Unit 3': {
    sleep: 'Flexible',
    social: 'Moderately social',
    noise: 'Need silence',
  },
  Foothill: {
    sleep: 'Early to bed',
    social: 'Prefer quiet',
    noise: 'Need silence',
  },
  'Clark Kerr': {
    sleep: 'Flexible',
    social: 'Very social',
    noise: 'Noisy environment is fine',
  },
  'Blackwell': {
    sleep: 'Early to bed',
    social: 'Prefer quiet',
    noise: 'Need silence',
  }
};

function calculateCompatibility(
  answers: Record<number, string>,
  profile: DormProfile,
): number {
  let match = 0;
  let total = 0;
  if (profile.sleep && answers[1]) {
    total++;
    if (answers[1] === profile.sleep) match++;
  }
  if (profile.social && answers[2]) {
    total++;
    if (answers[2] === profile.social) match++;
  }
  if (profile.noise && answers[3]) {
    total++;
    if (answers[3] === profile.noise) match++;
  }
  if (total === 0) return 0;
  return Math.round((match / total) * 100);
}

function computeSentiment(posts: RedditPost[]): number {
  if (posts.length === 0) return 50;
  let total = 0;
  for (const post of posts) {
    const text = `${post.title} ${post.content}`.toLowerCase();
    let score = 0;
    for (const word of POSITIVE_KEYWORDS) {
      if (text.includes(word)) score++;
    }
    for (const word of NEGATIVE_KEYWORDS) {
      if (text.includes(word)) score--;
    }
    total += score;
  }
  const avg = total / posts.length;
  const normalized = Math.max(0, Math.min(100, Math.round(50 + avg * 10)));
  return normalized;
}

export function computeDormScore(
  dorm: string,
  answers: Record<number, string>,
): number {
  const data = loadRedditData();
  const posts = data.housing.filter((p) => {
    const text = `${p.title} ${p.content}`.toLowerCase();
    return text.includes(dorm.toLowerCase());
  });
  const sentiment = computeSentiment(posts);
  const profile = DORM_PROFILES[dorm] || {
    sleep: '',
    social: '',
    noise: '',
  };
  const compatibility = calculateCompatibility(answers, profile);
  return Math.round((sentiment + compatibility) / 2);
}

export function getDormPosts(
  dorm: string,
  limit = 3,
): Array<{ title: string; url: string }> {
  const data = loadRedditData();
  const posts = data.housing.filter((p) => {
    const text = `${p.title} ${p.content}`.toLowerCase();
    return text.includes(dorm.toLowerCase());
  });
  return posts.slice(0, limit).map((p) => ({ title: p.title, url: p.url }));
}

const POSITIVE_KEYWORDS = [
    "clean", "quiet", "spacious", "friendly", "modern", "great", "amazing", "beautiful",
    "safe", "well-maintained", "close", "convenient", "community", "sunny", "comfortable",
    "fun", "social", "bright", "open", "new", "peaceful", "organized", "affordable",
    "helpful", "cozy", "responsive", "supportive", "inclusive", "engaging", "accessible",
    "upgraded", "walkable", "green", "secure", "fast", "reliable", "vibrant", "respectful"
  ];

const NEGATIVE_KEYWORDS = [
    "dirty", "noisy", "small", "old", "bad", "gross", "bugs", "unsafe", "far", "isolated",
    "mold", "leak", "broken", "smelly", "dark", "crowded", "expensive", "thin walls",
    "cold", "hot", "rude", "slow", "neglected", "creaky", "flood", "insects", "rats",
    "damp", "inconvenient", "disconnected", "poor lighting", "maintenance issues",
    "trash", "overpriced", "unstable", "inaccessible", "hard to reach", "outdated",
    "filthy", "disgusting", "uncomfortable"
  ];

function extractSentences(text: string): string[] {
  return text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function getPros(dorm: string, limit = 3): string[] {
  const data = loadRedditData();
  const posts = data.housing.filter((p) => {
    const text = `${p.title} ${p.content}`.toLowerCase();
    return text.includes(dorm.toLowerCase());
  });
  const pros: string[] = [];
  for (const post of posts) {
    const sentences = extractSentences(`${post.title}. ${post.content}`);
    for (const sent of sentences) {
      const lc = sent.toLowerCase();
      if (lc.includes(dorm.toLowerCase()) && POSITIVE_KEYWORDS.some((w) => lc.includes(w))) {
        pros.push(sent);
        if (pros.length >= limit) return pros;
      }
    }
  }
  return pros.slice(0, limit);
}

export function getCons(dorm: string, limit = 3): string[] {
  const data = loadRedditData();
  const posts = data.housing.filter((p) => {
    const text = `${p.title} ${p.content}`.toLowerCase();
    return text.includes(dorm.toLowerCase());
  });
  const cons: string[] = [];
  for (const post of posts) {
    const sentences = extractSentences(`${post.title}. ${post.content}`);
    for (const sent of sentences) {
      const lc = sent.toLowerCase();
      if (lc.includes(dorm.toLowerCase()) && NEGATIVE_KEYWORDS.some((w) => lc.includes(w))) {
        cons.push(sent);
        if (cons.length >= limit) return cons;
      }
    }
  }
  return cons.slice(0, limit);
}

import fs from 'fs';
import path from 'path';
import vader from 'vader-sentiment'; 

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
const DEFAULT_PROS = ["Clean", "Social", "Close to campus"];
const DEFAULT_CONS = ["Loud", "Busy"];
  
const ALL_DORMS = [
    "Unit 1",
    "Unit 2",
    "Unit 3",
    "Foothill",
    "Clark Kerr",
    "Blackwell",
  ];

function extractSentences(text: string): string[] {
  return text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function extractKeywords(sentence: string, keywords: string[]): string[] {
    const lc = sentence.toLowerCase();
    return keywords.filter((w) => lc.includes(w));
  }
  
  function analyzeKeywords(
    dorm: string,
    keywords: string[],
    positive: boolean,
    limit: number,
  ): string[] {
    const data = loadRedditData();
    const dormRegex = new RegExp(`\\b${dorm.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\s+/g, "\\s*")}\\b`, "i");
    const otherDorms = ALL_DORMS.filter((d) => d !== dorm);
    const otherRegexes = otherDorms.map((d) => new RegExp(`\\b${d.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\s+/g, "\\s*")}\\b`, "i"));
  
    const posts = data.housing.filter((p) => {
      const text = `${p.title} ${p.content}`;
      return dormRegex.test(text);
    });
  
    const results: string[] = [];
  
    const recordKeyword = (kw: string) => {
      const cap = kw.charAt(0).toUpperCase() + kw.slice(1);
      if (!results.includes(cap)) {
        results.push(cap);
      }
    };
  
    const analyzeSegment = (segment: string) => {
      const score = vader.SentimentIntensityAnalyzer.polarity_scores(segment).compound;
      if ((positive && score > 0) || (!positive && score < 0)) {
        for (const kw of extractKeywords(segment, keywords)) {
          recordKeyword(kw);
          if (results.length >= limit) return true;
        }
      }
      return false;
    };
  
    for (const post of posts) {
      const sentences = extractSentences(`${post.title}. ${post.content}`);
      for (const sentence of sentences) {
        if (!dormRegex.test(sentence)) continue;
  
        // If sentence mentions other dorms, try to split by connectors
        const hasOther = otherRegexes.some((r) => r.test(sentence));
        if (hasOther) {
          const segments = sentence.split(/\b(?:but|however|although|though|whereas|while|than)\b/i);
          for (const seg of segments) {
            if (dormRegex.test(seg) && !otherRegexes.some((r) => r.test(seg))) {
              if (analyzeSegment(seg)) break;
            }
          }
        } else {
          if (analyzeSegment(sentence)) continue;
        }
        if (results.length >= limit) break;
      }
      if (results.length >= limit) break;
    }
  
    if (results.length === 0) {
      return (positive ? DEFAULT_PROS : DEFAULT_CONS).slice(0, limit);
    }
  
    return results.slice(0, limit);
  }
  
  export function getPros(dorm: string, limit = 3): string[] {
    return analyzeKeywords(dorm, POSITIVE_KEYWORDS, true, limit);
  }
  
  export function getCons(dorm: string, limit = 3): string[] {
    return analyzeKeywords(dorm, NEGATIVE_KEYWORDS, false, limit);
  }
  
  interface KeywordDebug {
    keywords: string[];
    sources: string[];
    count: number;
  }
  
  function analyzeKeywordsDebug(
    dorm: string,
    keywords: string[],
    positive: boolean,
    limit: number,
  ): KeywordDebug {
    const data = loadRedditData();
    const dormRegex = new RegExp(`\\b${dorm.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\s+/g, "\\s*")}\\b`, "i");
    const otherDorms = ALL_DORMS.filter((d) => d !== dorm);
    const otherRegexes = otherDorms.map((d) => new RegExp(`\\b${d.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\s+/g, "\\s*")}\\b`, "i"));
  
    const posts = data.housing.filter((p) => {
      const text = `${p.title} ${p.content}`;
      return dormRegex.test(text);
    });
  
    const results: string[] = [];
    const sources: string[] = [];
  
    const recordKeyword = (kw: string, title: string) => {
      const cap = kw.charAt(0).toUpperCase() + kw.slice(1);
      if (!results.includes(cap)) {
        results.push(cap);
      }
      if (!sources.includes(title)) {
        sources.push(title);
      }
    };
  
    const analyzeSegment = (segment: string, title: string) => {
      const score = vader.SentimentIntensityAnalyzer.polarity_scores(segment).compound;
      if ((positive && score > 0) || (!positive && score < 0)) {
        for (const kw of extractKeywords(segment, keywords)) {
          recordKeyword(kw, title);
          if (results.length >= limit) return true;
        }
      }
      return false;
    };
  
    for (const post of posts) {
      const sentences = extractSentences(`${post.title}. ${post.content}`);
      for (const sentence of sentences) {
        if (!dormRegex.test(sentence)) continue;
  
        const hasOther = otherRegexes.some((r) => r.test(sentence));
        if (hasOther) {
          const segments = sentence.split(/\b(?:but|however|although|though|whereas|while|than)\b/i);
          for (const seg of segments) {
            if (dormRegex.test(seg) && !otherRegexes.some((r) => r.test(seg))) {
              if (analyzeSegment(seg, post.title)) break;
            }
          }
        } else {
          if (analyzeSegment(sentence, post.title)) continue;
        }
        if (results.length >= limit) break;
      }
      if (results.length >= limit) break;
    }
  
    const keywordsResult = results.length === 0 ? (positive ? DEFAULT_PROS : DEFAULT_CONS).slice(0, limit) : results.slice(0, limit);
  
    return { keywords: keywordsResult, sources, count: posts.length };
  }
  
  export function getProsDebug(dorm: string, limit = 3): KeywordDebug {
    return analyzeKeywordsDebug(dorm, POSITIVE_KEYWORDS, true, limit);
  }
  
  export function getConsDebug(dorm: string, limit = 3): KeywordDebug {
    return analyzeKeywordsDebug(dorm, NEGATIVE_KEYWORDS, false, limit);
  }
  
  export function countDormPosts(dorm: string): number {
    const data = loadRedditData();
    const dormRegex = new RegExp(`\\b${dorm.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\s+/g, "\\s*")}\\b`, "i");
    return data.housing.filter((p) => dormRegex.test(`${p.title} ${p.content}`)).length;
  }
  
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const questions = [
    {
      id: 1,
      question: "What's your typical sleep schedule?",
      type: 'multiple_choice',
      options: ['Early to bed', 'Night owl', 'Flexible']
    },
    {
      id: 2,
      question: 'How social are you?',
      type: 'multiple_choice',
      options: ['Very social', 'Moderately social', 'Prefer quiet']
    },
    {
      id: 3,
      question: "What's your noise tolerance?",
      type: 'multiple_choice',
      options: ['Need silence', 'Can handle some noise', 'Noisy environment is fine']
    },
    {
      id: 4,
      question: 'Do you prefer having roommates or living alone?',
      type: 'multiple_choice',
      options: ['Roommates', 'Single room', 'No preference']
    },
    {
      id: 5,
      question: 'How important is proximity to dining halls?',
      type: 'multiple_choice',
      options: ['Very important', 'Somewhat important', 'Not important']
    }
  ];

  return NextResponse.json({ questions });
}

export async function POST(request: NextRequest) {
  // Normally use responses to generate AI questions
  await request.json();
  const ai_questions = [
    { id: 'ai1', question: 'Describe your ideal dorm environment.', type: 'text' },
    { id: 'ai2', question: 'What worries you most about freshman housing?', type: 'text' },
    { id: 'ai3', question: 'List any must-have amenities for your dorm.', type: 'text' }
  ];

  return NextResponse.json({ ai_questions });
}
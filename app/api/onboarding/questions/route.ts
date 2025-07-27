import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const questions = [
    {
      id: 1,
      question: 'Which part of campus do you prefer to live in?',
      type: 'multiple_choice',
      options: ['Northside', 'Southside', 'Westside', 'No preference']
    },
    {
      id: 2,
      question: 'Do you value a social atmosphere or a quiet environment?',
      type: 'multiple_choice',
      options: ['Social', 'Quiet', 'Balanced']
    },
    {
      id: 3,
      question: 'What is your monthly housing budget?',
      type: 'multiple_choice',
      options: ['<$1000', '$1000-$1500', '$1500-$2000', '$2000+']
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
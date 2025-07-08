import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { responses } = body;
    
    // Generate AI follow-up questions based on initial responses
    const followUpQuestions = [
      {
        id: "dorm_followup_1",
        question: "What's your budget range for housing?",
        type: "multiple_choice",
        options: ["$800-1200", "$1200-1600", "$1600-2000", "$2000+"]
      },
      {
        id: "dorm_followup_2", 
        question: "Do you prefer a single room or are you open to roommates?",
        type: "multiple_choice",
        options: ["Single room only", "Open to roommates", "Prefer roommates", "No preference"]
      },
      {
        id: "dorm_followup_3",
        question: "How important is proximity to campus vs. cost?",
        type: "multiple_choice", 
        options: ["Very close to campus", "Moderate distance", "Cost is more important", "Balanced approach"]
      }
    ];

    return NextResponse.json({
      success: true,
      follow_up_questions: followUpQuestions
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 
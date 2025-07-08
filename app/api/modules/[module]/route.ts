import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module: moduleName } = await params;
    
    // Fetch real data from backend API
    const response = await fetch(`${BACKEND_URL}/api/module/${moduleName}/questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching module data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module data from backend' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module: moduleName } = await params;
    const body = await request.json();
    
    // Check if this is the initial quiz submission or AI questions submission
    const hasAIQuestions = body.responses && Array.isArray(body.responses) && body.responses.some((r: any) => r.question_id && (r.question_id.startsWith('cs_') || r.question_id.startsWith('eng_') || r.question_id.startsWith('bus_') || r.question_id.startsWith('explore_') || r.question_id.startsWith('support_') || r.question_id.startsWith('freshman_')));
    
    if (hasAIQuestions) {
      // This is AI questions submission - return recommendations
      const mockData = getMockDataForModule(moduleName);
      return NextResponse.json({ 
        follow_up_questions: [],
        recommendations: mockData.recommendations || []
      });
    } else {
      // This is initial quiz submission - return AI questions
      const mockFollowUpQuestions = getMockAIQuestionsForModule(moduleName, body.responses || []);
      return NextResponse.json({ follow_up_questions: mockFollowUpQuestions });
    }
  } catch (error) {
    console.error('Error submitting module questions:', error);
    return NextResponse.json(
      { error: 'Failed to submit module questions' },
      { status: 500 }
    );
  }
}

// Mock data functions that will be replaced with real backend integration
function getMockDataForModule(moduleName: string) {
  switch (moduleName) {
    case 'enrollment':
      return {
        questions: [
          {
            id: 1,
            question: "What's your intended major or area of interest?",
            options: ["Computer Science", "Engineering", "Business", "Arts & Humanities", "Social Sciences", "Natural Sciences", "Undeclared/Exploring"],
            type: "multiple_choice"
          },
          {
            id: 2,
            question: "How confident are you about your course selection?",
            options: ["Very confident - I know exactly what I want to study", "Somewhat confident - I have a general idea", "Not very confident - I'm still exploring options", "Completely unsure - I need guidance"],
            type: "multiple_choice"
          },
          {
            id: 3,
            question: "What's your preferred class size?",
            options: ["Small discussion-based classes (15-30 students)", "Medium-sized lectures with discussion sections (50-100 students)", "Large lecture halls (100+ students)", "I don't have a preference"],
            type: "multiple_choice"
          },
          {
            id: 4,
            question: "How many units are you planning to take in your first semester?",
            options: ["12-13 units (lighter load to adjust)", "14-16 units (standard freshman load)", "17-18 units (heavier load)", "I'm not sure yet"],
            type: "multiple_choice"
          },
          {
            id: 5,
            question: "What are your main goals for your first semester? (Select all that apply)",
            options: ["Get good grades and maintain a high GPA", "Explore different subjects and find my passion", "Make friends and build social connections", "Get involved in campus activities and clubs", "Develop good study habits and time management", "Take courses that fulfill general education requirements"],
            type: "multiple_choice",
            multi_select: true
          }
        ],
        recommendations: [
          {
            id: "rec_1",
            title: "CS 61A - Structure and Interpretation of Computer Programs",
            description: "Perfect first course for CS majors and anyone interested in programming. Great professor, engaging content, and excellent for building a strong foundation.",
            code: "CS 61A",
            department: "Computer Science",
            units: 4,
            professor: "John DeNero",
            score: 95,
            rmp_rating: 4.8,
            why_perfect: [
              "Excellent introduction to programming concepts",
              "Great for building problem-solving skills",
              "Perfect for freshman CS majors",
              "Strong community and support system"
            ],
            student_quotes: [
              {
                quote: "As a freshman, this course completely changed how I think about programming. The professor is amazing!",
                source: "Reddit r/berkeley"
              },
              {
                quote: "Perfect first CS course. The projects are challenging but rewarding.",
                source: "RateMyProfessors"
              }
            ],
            requirements_fulfilled: ["CS Major Requirement", "General Education"],
            also_liked: ["CS 61B", "CS 70", "Data 8"]
          },
          {
            id: "rec_2",
            title: "Math 1A - Calculus",
            description: "Essential foundation course for STEM majors. Clear explanations and good pace for freshmen.",
            code: "Math 1A",
            department: "Mathematics",
            units: 4,
            professor: "Alexander Paulin",
            score: 88,
            rmp_rating: 4.2,
            why_perfect: [
              "Required for many STEM majors",
              "Good pace for freshman students",
              "Clear explanations and examples",
              "Strong support resources available"
            ],
            student_quotes: [
              {
                quote: "Great introduction to college-level math. The professor explains concepts clearly.",
                source: "RateMyProfessors"
              },
              {
                quote: "Perfect for freshmen who want to get their math requirements done early.",
                source: "Reddit r/berkeley"
              }
            ],
            requirements_fulfilled: ["Math Requirement", "STEM Major Prerequisite"],
            also_liked: ["Math 1B", "Math 53", "Math 54"]
          },
          {
            id: "rec_3",
            title: "English R1A - Reading and Composition",
            description: "Excellent writing course that helps develop critical thinking and communication skills essential for college success.",
            code: "English R1A",
            department: "English",
            units: 4,
            professor: "Victoria Kahn",
            score: 92,
            rmp_rating: 4.5,
            why_perfect: [
              "Fulfills writing requirement",
              "Small class size for personalized attention",
              "Great for developing college-level writing skills",
              "Engaging topics and readings"
            ],
            student_quotes: [
              {
                quote: "This course really helped me improve my writing. The professor gives great feedback.",
                source: "RateMyProfessors"
              },
              {
                quote: "Perfect freshman writing course. Small class size makes it less intimidating.",
                source: "Reddit r/berkeley"
              }
            ],
            requirements_fulfilled: ["Reading & Composition Requirement"],
            also_liked: ["English R1B", "College Writing R1A", "Rhetoric R1A"]
          },
          {
            id: "rec_4",
            title: "Data 8 - Foundations of Data Science",
            description: "Modern, engaging course that introduces data science concepts using Python. Great for any major.",
            code: "Data 8",
            department: "Data Science",
            units: 4,
            professor: "John DeNero",
            score: 90,
            rmp_rating: 4.6,
            why_perfect: [
              "No prerequisites required",
              "Teaches practical programming skills",
              "Relevant to many fields and careers",
              "Great introduction to data science"
            ],
            student_quotes: [
              {
                quote: "Amazing course for freshmen! No programming experience needed and you learn so much.",
                source: "Reddit r/berkeley"
              },
              {
                quote: "Perfect first semester course. The projects are fun and practical.",
                source: "RateMyProfessors"
              }
            ],
            requirements_fulfilled: ["Data Science Major Requirement", "General Education"],
            also_liked: ["CS 61A", "Stat 20", "Data 100"]
          },
          {
            id: "rec_5",
            title: "Psych 1 - General Psychology",
            description: "Fascinating introduction to psychology that's perfect for freshmen exploring different fields.",
            code: "Psych 1",
            department: "Psychology",
            units: 4,
            professor: "Dacher Keltner",
            score: 87,
            rmp_rating: 4.4,
            why_perfect: [
              "No prerequisites required",
              "Engaging and accessible content",
              "Great for exploring psychology as a major",
              "Fulfills breadth requirements"
            ],
            student_quotes: [
              {
                quote: "Perfect freshman course! The professor is engaging and the material is fascinating.",
                source: "RateMyProfessors"
              },
              {
                quote: "Great way to fulfill breadth requirements while learning something interesting.",
                source: "Reddit r/berkeley"
              }
            ],
            requirements_fulfilled: ["Biological Sciences Breadth", "General Education"],
            also_liked: ["Psych 2", "Psych 3", "Psych 4"]
          }
        ]
      };
    
    case 'dorm':
      return {
        questions: [
          {
            id: 1,
            question: "Are you planning to live on-campus for your freshman year?",
            options: ["Yes, definitely", "I'm considering it", "No, I prefer off-campus", "I'm not sure yet"],
            type: "multiple_choice"
          },
          {
            id: 2,
            question: "What's your budget range for housing?",
            options: ["Under $800/month", "$800-$1200/month", "$1200-$1600/month", "$1600+/month"],
            type: "multiple_choice"
          },
          {
            id: 3,
            question: "What's most important to you in a dorm?",
            options: ["Quiet study environment", "Social atmosphere", "Close to classes", "Good food options", "Modern facilities"],
            type: "multiple_choice",
            multi_select: true
          },
          {
            id: 4,
            question: "Do you have a roommate preference?",
            options: ["I want a roommate", "I prefer a single room", "I'm open to either", "I have a specific roommate in mind"],
            type: "multiple_choice"
          },
          {
            id: 5,
            question: "What activities are you most interested in?",
            options: ["Studying and academics", "Sports and fitness", "Arts and music", "Social events", "Community service"],
            type: "multiple_choice",
            multi_select: true
          }
        ]
      };
    
    case 'job':
      return {
        questions: [
          {
            id: 1,
            question: "What type of work are you looking for?",
            options: ["On-campus job", "Internship", "Part-time job", "Full-time job", "Freelance work"],
            type: "multiple_choice"
          },
          {
            id: 2,
            question: "What's your field of interest?",
            options: ["Technology/CS", "Business", "Research", "Education", "Healthcare", "Arts", "Other"],
            type: "multiple_choice"
          },
          {
            id: 3,
            question: "What skills do you have?",
            options: ["Programming", "Data Analysis", "Writing", "Design", "Research", "Customer Service", "Teaching"],
            type: "multiple_choice",
            multi_select: true
          },
          {
            id: 4,
            question: "How many hours per week can you work?",
            options: ["5-10 hours", "10-15 hours", "15-20 hours", "20+ hours"],
            type: "multiple_choice"
          },
          {
            id: 5,
            question: "What's your experience level?",
            options: ["No experience", "Some experience", "Experienced", "Very experienced"],
            type: "multiple_choice"
          }
        ]
      };
    
    case 'community':
      return {
        questions: [
          {
            id: 1,
            question: "What types of organizations interest you?",
            options: ["Academic/Professional", "Cultural/Identity", "Sports/Athletics", "Arts/Creative", "Service/Volunteer", "Political/Activism"],
            type: "multiple_choice",
            multi_select: true
          },
          {
            id: 2,
            question: "How much time can you commit to activities?",
            options: ["1-2 hours/week", "3-5 hours/week", "5-10 hours/week", "10+ hours/week"],
            type: "multiple_choice"
          },
          {
            id: 3,
            question: "What are your main interests?",
            options: ["Technology", "Sports", "Music", "Art", "Politics", "Environment", "Social Justice", "Business"],
            type: "multiple_choice",
            multi_select: true
          },
          {
            id: 4,
            question: "Are you looking for leadership opportunities?",
            options: ["Yes, definitely", "Maybe, if the opportunity arises", "No, just want to participate"],
            type: "multiple_choice"
          },
          {
            id: 5,
            question: "What's your preferred group size?",
            options: ["Small (under 20 people)", "Medium (20-50 people)", "Large (50+ people)", "No preference"],
            type: "multiple_choice"
          }
        ]
      };
    
    case 'academic-support':
      return {
        questions: [
          {
            id: 1,
            question: "What subjects do you need help with?",
            options: ["Math", "Science", "Writing", "Computer Science", "Languages", "Other"],
            type: "multiple_choice",
            multi_select: true
          },
          {
            id: 2,
            question: "What type of support do you prefer?",
            options: ["One-on-one tutoring", "Group study sessions", "Online resources", "Office hours", "All of the above"],
            type: "multiple_choice"
          },
          {
            id: 3,
            question: "How often do you need academic support?",
            options: ["Rarely", "Occasionally", "Regularly", "Frequently"],
            type: "multiple_choice"
          }
        ]
      };
    
    case 'health':
      return {
        questions: [
          {
            id: 1,
            question: "What fitness activities interest you?",
            options: ["Cardio", "Strength training", "Yoga", "Team sports", "Swimming", "Dance", "Other"],
            type: "multiple_choice",
            multi_select: true
          },
          {
            id: 2,
            question: "What's your fitness experience level?",
            options: ["Beginner", "Intermediate", "Advanced", "Very experienced"],
            type: "multiple_choice"
          },
          {
            id: 3,
            question: "What wellness services are you interested in?",
            options: ["Mental health counseling", "Nutrition advice", "Stress management", "Sleep support", "All of the above"],
            type: "multiple_choice",
            multi_select: true
          }
        ]
      };
    
    default:
      return { questions: [] };
  }
}

function getMockAIQuestionsForModule(moduleName: string, responses: any[]) {
  switch (moduleName) {
    case 'enrollment':
      const major = responses.find(r => r.question_id === 1)?.answer;
      const confidenceLevel = responses.find(r => r.question_id === 2)?.answer;
      
      const questions = [];
      
      // Major-specific questions
      if (major === "Computer Science") {
        questions.push({
          id: "cs_1",
          question: "Do you have any programming experience? If so, what languages?",
          type: "text"
        });
        questions.push({
          id: "cs_2",
          question: "Are you interested in AI/ML, web development, or general software engineering?",
          type: "text"
        });
      } else if (major === "Engineering") {
        questions.push({
          id: "eng_1",
          question: "Which engineering discipline interests you most? (e.g., mechanical, electrical, civil)",
          type: "text"
        });
        questions.push({
          id: "eng_2",
          question: "Do you enjoy hands-on projects and building things?",
          type: "text"
        });
      } else if (major === "Business") {
        questions.push({
          id: "bus_1",
          question: "Are you interested in entrepreneurship, finance, marketing, or general business?",
          type: "text"
        });
        questions.push({
          id: "bus_2",
          question: "Do you want to get involved in business clubs or competitions?",
          type: "text"
        });
      } else if (major === "Undeclared/Exploring") {
        questions.push({
          id: "explore_1",
          question: "What subjects did you enjoy most in high school?",
          type: "text"
        });
        questions.push({
          id: "explore_2",
          question: "What are your biggest concerns about choosing a major?",
          type: "text"
        });
      }
      
      // Confidence-based questions
      if (confidenceLevel && (confidenceLevel.includes("not very confident") || confidenceLevel.includes("completely unsure"))) {
        questions.push({
          id: "support_1",
          question: "What kind of academic support would be most helpful for you?",
          type: "text"
        });
        questions.push({
          id: "support_2",
          question: "Are you worried about the transition from high school to college?",
          type: "text"
        });
      }
      
      // Freshman-specific questions for everyone
      questions.push({
        id: "freshman_1",
        question: "What's your biggest excitement about starting college?",
        type: "text"
      });
      
      questions.push({
        id: "freshman_2", 
        question: "Do you have any AP/IB credits or college credits from high school?",
        type: "text"
      });
      
      questions.push({
        id: "freshman_3",
        question: "What's your preferred study environment? (e.g., library, dorm room, study groups)",
        type: "text"
      });
      
      return questions;
    
    case 'dorm':
      const budget = responses.find(r => r.question_id === 1)?.answer;
      const dormImportance = responses.find(r => r.question_id === 2)?.answer;
      
      const dormQuestions = [];
      
      if (budget?.includes('Under $800')) {
        dormQuestions.push({
          id: "followup_1",
          question: "Are you open to sharing a room with multiple roommates to save on costs?",
          type: "text"
        });
      }
      
      if (dormImportance?.includes('Social atmosphere')) {
        dormQuestions.push({
          id: "followup_2",
          question: "What types of social activities are you most interested in? (e.g., parties, study groups, cultural events)",
          type: "text"
        });
      } else if (dormImportance?.includes('Quiet study')) {
        dormQuestions.push({
          id: "followup_2",
          question: "How important is it for you to have designated quiet hours in your dorm?",
          type: "text"
        });
      }
      
      dormQuestions.push({
        id: "followup_3",
        question: "Do you have any dietary restrictions or food preferences we should know about?",
        type: "text"
      });
      
      return dormQuestions;
    
    case 'job':
      const workType = responses.find(r => r.question_id === 1)?.answer;
      const field = responses.find(r => r.question_id === 2)?.answer;
      
      const jobQuestions = [];
      
      if (workType?.includes('Internship')) {
        jobQuestions.push({
          id: "followup_1",
          question: "What specific companies or organizations would you love to intern for?",
          type: "text"
        });
        jobQuestions.push({
          id: "followup_2",
          question: "What are your career goals for the next few years?",
          type: "text"
        });
      } else if (workType?.includes('On-campus')) {
        jobQuestions.push({
          id: "followup_1",
          question: "What campus departments or services interest you most? (e.g., library, dining, recreation, academic support)",
          type: "text"
        });
      }
      
      if (field?.includes('Technology/CS')) {
        jobQuestions.push({
          id: "followup_3",
          question: "What programming languages or technologies are you most comfortable with?",
          type: "text"
        });
      }
      
      return jobQuestions;
    
    case 'community':
      const orgTypes = responses.find(r => r.question_id === 1)?.answer;
      const leadership = responses.find(r => r.question_id === 2)?.answer;
      
      const communityQuestions = [];
      
      if (orgTypes?.includes('Cultural/Identity')) {
        communityQuestions.push({
          id: "followup_1",
          question: "Are there any specific cultural or identity-based organizations you're looking for?",
          type: "text"
        });
      } else if (orgTypes?.includes('Service/Volunteer')) {
        communityQuestions.push({
          id: "followup_1",
          question: "What causes or community service areas are you most passionate about?",
          type: "text"
        });
      }
      
      if (leadership?.includes('Yes, definitely')) {
        communityQuestions.push({
          id: "followup_2",
          question: "What leadership experience do you have from high school or other activities?",
          type: "text"
        });
      }
      
      communityQuestions.push({
        id: "followup_3",
        question: "What skills would you like to develop through your involvement?",
        type: "text"
      });
      
      return communityQuestions;
    
    default:
      return [];
  }
} 
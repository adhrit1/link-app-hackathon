import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const { module: moduleName } = await params;
    const body = await request.json();
    
    // Generate mock recommendations based on the real data structure
    const mockRecommendations = getMockRecommendationsForModule(moduleName, body.responses);
    
    return NextResponse.json({ recommendations: mockRecommendations });
  } catch (error) {
    console.error('Error processing AI questions:', error);
    return NextResponse.json(
      { error: 'Failed to process AI questions' },
      { status: 500 }
    );
  }
}

function getMockRecommendationsForModule(moduleName: string, responses: any[]) {
  switch (moduleName) {
    case 'enrollment':
      return {
        recommendations: [
          {
            id: "cs61a",
            title: "CS61A - The Structure and Interpretation of Computer Programs",
            description: "Introduction to programming and computer science fundamentals using Python",
            code: "COMPSCI 61A",
            department: "Computer Science",
            units: 4,
            professor: "John DeNero",
            score: 95,
            rmp_rating: 4.8,
            why_perfect: [
              "Perfect for beginners with no programming experience",
              "Excellent professor with high student satisfaction",
              "Comprehensive introduction to CS fundamentals",
              "Great foundation for CS major declaration"
            ],
            student_quotes: [
              {
                quote: "Best intro CS class I've ever taken. DeNero is amazing!",
                source: "Reddit r/berkeley"
              },
              {
                quote: "Challenging but very rewarding. Great foundation for CS major.",
                source: "RateMyProfessors"
              },
              {
                quote: "DeNero makes complex topics so accessible. Love his teaching style!",
                source: "BerkeleyTime Reviews"
              }
            ],
            requirements_fulfilled: ["CS Major Lower Division", "Data Science Prerequisite"],
            also_liked: ["CS61B", "CS70", "Data 8", "CS88"],
            reddit_data: {
              posts: [
                {
                  title: "CS61A with DeNero - Best intro CS class ever?",
                  content: "Just finished CS61A and wow, DeNero is incredible. The way he explains recursion and higher-order functions is mind-blowing. Highly recommend!",
                  upvotes: 127,
                  comments: 23
                },
                {
                  title: "CS61A vs CS88 for non-CS major",
                  content: "I'm a business major but interested in programming. Should I take CS61A or CS88? Heard great things about DeNero.",
                  upvotes: 89,
                  comments: 15
                }
              ]
            },
            enrollment_status: "Open",
            difficulty_rating: 3,
            workload_hours: 12
          },
          {
            id: "cs61b",
            title: "CS61B - Data Structures",
            description: "Advanced programming and data structures using Java",
            code: "COMPSCI 61B",
            department: "Computer Science", 
            units: 4,
            professor: "Josh Hug",
            score: 92,
            rmp_rating: 4.9,
            why_perfect: [
              "Essential for CS major declaration",
              "Excellent data structures foundation",
              "Great professor with engaging teaching style",
              "Perfect follow-up to CS61A"
            ],
            student_quotes: [
              {
                quote: "Hug is the best! Makes complex topics so clear.",
                source: "Reddit r/berkeley"
              },
              {
                quote: "Challenging but very well-taught. Highly recommend!",
                source: "RateMyProfessors"
              },
              {
                quote: "The projects are tough but you learn so much. Hug's explanations are gold.",
                source: "BerkeleyTime Reviews"
              }
            ],
            requirements_fulfilled: ["CS Major Lower Division", "Data Science Prerequisite"],
            also_liked: ["CS61A", "CS70", "CS61C", "CS170"],
            reddit_data: {
              posts: [
                {
                  title: "CS61B with Hug - Project 2 is killing me",
                  content: "Anyone else struggling with Project 2? The concepts are clear but implementation is tough. Hug's office hours are super helpful though.",
                  upvotes: 156,
                  comments: 34
                },
                {
                  title: "CS61B vs CS61C - which to take first?",
                  content: "I'm planning my schedule and wondering if I should take 61B or 61C first. Any advice?",
                  upvotes: 67,
                  comments: 12
                }
              ]
            },
            enrollment_status: "Open",
            difficulty_rating: 4,
            workload_hours: 15
          },
          {
            id: "cs70",
            title: "CS70 - Discrete Mathematics and Probability Theory",
            description: "Mathematical foundations for computer science",
            code: "COMPSCI 70",
            department: "Computer Science",
            units: 4,
            professor: "Satish Rao",
            score: 88,
            rmp_rating: 4.6,
            why_perfect: [
              "Essential for CS major declaration",
              "Strong mathematical foundation",
              "Great for theoretical CS",
              "Excellent professor with clear explanations"
            ],
            student_quotes: [
              {
                quote: "Rao makes probability theory actually make sense!",
                source: "Reddit r/berkeley"
              },
              {
                quote: "Challenging but very rewarding. Great for CS theory.",
                source: "RateMyProfessors"
              }
            ],
            requirements_fulfilled: ["CS Major Lower Division", "Data Science Prerequisite"],
            also_liked: ["CS61A", "CS61B", "Math 55", "CS170"],
            reddit_data: {
              posts: [
                {
                  title: "CS70 - Probability theory help needed",
                  content: "Struggling with the probability section. Any tips for understanding the concepts better?",
                  upvotes: 98,
                  comments: 18
                }
              ]
            },
            enrollment_status: "Open",
            difficulty_rating: 4,
            workload_hours: 14
          },
          {
            id: "data8",
            title: "Data 8 - Foundations of Data Science",
            description: "Introduction to data science with Python",
            code: "DATA 8",
            department: "Data Science",
            units: 4,
            professor: "John DeNero",
            score: 90,
            rmp_rating: 4.7,
            why_perfect: [
              "Perfect introduction to data science",
              "Great for non-CS majors",
              "Excellent professor",
              "Practical applications"
            ],
            student_quotes: [
              {
                quote: "Amazing intro to data science! DeNero is fantastic.",
                source: "Reddit r/berkeley"
              },
              {
                quote: "Great class for beginners. Very accessible.",
                source: "RateMyProfessors"
              }
            ],
            requirements_fulfilled: ["Data Science Major", "CS Minor"],
            also_liked: ["CS61A", "CS88", "Stat 20", "Info 159"],
            reddit_data: {
              posts: [
                {
                  title: "Data 8 vs CS61A for data science track",
                  content: "Which should I take first? I'm interested in data science but also want to learn programming fundamentals.",
                  upvotes: 134,
                  comments: 28
                }
              ]
            },
            enrollment_status: "Open",
            difficulty_rating: 2,
            workload_hours: 10
          },
          {
            id: "cs88",
            title: "CS88 - Computational Structures in Data Science",
            description: "Programming and computational thinking for data science",
            code: "COMPSCI 88",
            department: "Computer Science",
            units: 3,
            professor: "John DeNero",
            score: 87,
            rmp_rating: 4.5,
            why_perfect: [
              "Perfect for data science track",
              "Less intensive than CS61A",
              "Great professor",
              "Practical programming skills"
            ],
            student_quotes: [
              {
                quote: "Great intro to programming for data science!",
                source: "Reddit r/berkeley"
              },
              {
                quote: "Perfect if you want programming but not full CS major.",
                source: "RateMyProfessors"
              }
            ],
            requirements_fulfilled: ["Data Science Major", "CS Minor"],
            also_liked: ["Data 8", "CS61A", "Stat 20", "Info 159"],
            reddit_data: {
              posts: [
                {
                  title: "CS88 vs CS61A for non-CS major",
                  content: "I'm a stats major but want to learn programming. Which class is better?",
                  upvotes: 76,
                  comments: 14
                }
              ]
            },
            enrollment_status: "Open",
            difficulty_rating: 3,
            workload_hours: 8
          }
        ]
      };
    
    case 'dorm':
      return {
        recommendations: [
          {
            id: "unit1",
            title: "Unit 1 - Blackwell Hall",
            description: "Modern dormitory with excellent amenities and central location",
            location: "UC Berkeley Campus",
            roomType: "Double Room",
            amenities: ["Kitchen", "Study Lounge", "Gym Access", "Laundry", "WiFi"],
            score: 94,
            why_perfect: [
              "Perfect location near campus center",
              "Modern facilities and amenities",
              "Great social atmosphere for freshmen",
              "Close to dining halls and libraries"
            ],
            student_quotes: [
              {
                quote: "Best freshman dorm experience! Great location and facilities.",
                source: "Berkeley Housing Reviews"
              },
              {
                quote: "Clean, modern, and very convenient to classes.",
                source: "Student Feedback"
              },
              {
                quote: "Love the social atmosphere here. Made so many friends!",
                source: "Reddit r/berkeley"
              }
            ],
            roommateMatch: {
              name: "Alex Chen",
              compatibility: 87,
              sharedInterests: ["Computer Science", "Gaming", "Music"]
            },
            also_liked: ["Unit 2", "Unit 3", "Foothill", "Clark Kerr"],
            reddit_data: {
              posts: [
                {
                  title: "Unit 1 Blackwell Hall - Best freshman dorm?",
                  content: "Just got assigned to Unit 1. Heard great things about the location and facilities. Anyone have experience here?",
                  upvotes: 89,
                  comments: 16
                }
              ]
            }
          },
          {
            id: "unit2",
            title: "Unit 2 - Foothill",
            description: "Quiet, academic-focused dormitory near engineering buildings",
            location: "UC Berkeley Campus",
            roomType: "Single Room",
            amenities: ["Study Rooms", "Computer Lab", "Quiet Hours", "Laundry"],
            score: 89,
            why_perfect: [
              "Perfect for focused studying",
              "Close to engineering and science buildings",
              "Quiet, academic environment",
              "Great for introverts"
            ],
            student_quotes: [
              {
                quote: "Great for studying and quiet time. Perfect for introverts.",
                source: "Berkeley Housing Reviews"
              },
              {
                quote: "Love the quiet atmosphere. Perfect for getting work done.",
                source: "Student Feedback"
              }
            ],
            also_liked: ["Unit 1", "Unit 3", "Foothill", "Clark Kerr"],
            reddit_data: {
              posts: [
                {
                  title: "Unit 2 vs Foothill for quiet studying",
                  content: "I'm an engineering major and need a quiet place to study. Which is better?",
                  upvotes: 67,
                  comments: 12
                }
              ]
            }
          }
        ]
      };
    
    case 'job':
      return {
        recommendations: [
          {
            id: "cs_tutor",
            title: "CS Tutor - Academic Support Services",
            description: "Help fellow students with CS61A, CS61B, and other computer science courses",
            company: "UC Berkeley",
            location: "UC Berkeley Campus",
            salary: "$25/hour",
            jobType: "Part-time",
            score: 96,
            why_perfect: [
              "Perfect for CS students to reinforce knowledge",
              "Flexible hours around class schedule",
              "Great resume builder for teaching experience",
              "Excellent pay for on-campus job"
            ],
            student_quotes: [
              {
                quote: "Best on-campus job for CS majors. Great pay and experience.",
                source: "Handshake Reviews"
              },
              {
                quote: "Love helping other students learn. Very rewarding!",
                source: "Student Feedback"
              }
            ],
            alumniMentor: {
              name: "Sarah Johnson",
              title: "Software Engineer",
              company: "Google",
              availability: "Weekly coffee chats"
            },
            also_liked: ["Research Assistant", "Lab Assistant", "Peer Advisor", "Course Reader"],
            reddit_data: {
              posts: [
                {
                  title: "CS Tutor position - Best on-campus job?",
                  content: "Just got hired as a CS tutor. Anyone else have experience with this position?",
                  upvotes: 145,
                  comments: 23
                }
              ]
            }
          },
          {
            id: "research_assistant",
            title: "Research Assistant - EECS Department",
            description: "Assist faculty with cutting-edge computer science research",
            company: "UC Berkeley EECS",
            location: "UC Berkeley Campus",
            salary: "$20/hour",
            jobType: "Part-time",
            score: 88,
            why_perfect: [
              "Excellent research experience",
              "Work with leading CS faculty",
              "Great preparation for graduate school",
              "Interesting projects"
            ],
            also_liked: ["CS Tutor", "Lab Assistant", "Peer Advisor", "Course Reader"],
            reddit_data: {
              posts: [
                {
                  title: "Research Assistant positions in EECS",
                  content: "Looking for research experience. How do I find RA positions in the EECS department?",
                  upvotes: 123,
                  comments: 18
                }
              ]
            }
          }
        ]
      };
    
    case 'community':
      return {
        recommendations: [
          {
            id: "bcs",
            title: "Berkeley Computer Science Society",
            description: "Premier CS student organization with networking, workshops, and social events",
            category: "Academic/Professional",
            members: 450,
            meetingTime: "Tuesdays 6:00 PM",
            score: 95,
            why_perfect: [
              "Perfect for CS students to network",
              "Great professional development opportunities",
              "Strong community of like-minded students",
              "Excellent career connections"
            ],
            student_quotes: [
              {
                quote: "Best way to meet other CS students and get career opportunities!",
                source: "Berkeley Organizations"
              },
              {
                quote: "Amazing networking events and workshops.",
                source: "Student Feedback"
              }
            ],
            also_liked: ["Cal Hacks", "Women in CS", "Data Science Society", "AI Club"],
            reddit_data: {
              posts: [
                {
                  title: "BCS vs Cal Hacks - which to join?",
                  content: "I'm a CS major and want to join a student org. Which is better for networking and learning?",
                  upvotes: 167,
                  comments: 31
                }
              ]
            }
          },
          {
            id: "cal_hacks",
            title: "Cal Hacks",
            description: "UC Berkeley's premier hackathon organization",
            category: "Technology",
            members: 200,
            meetingTime: "Monthly events",
            score: 92,
            why_perfect: [
              "Excellent for building projects and skills",
              "Great networking with tech companies",
              "Fun, creative environment",
              "Amazing hackathon experience"
            ],
            also_liked: ["Berkeley CS Society", "Women in CS", "Data Science Society", "AI Club"],
            reddit_data: {
              posts: [
                {
                  title: "Cal Hacks hackathon experience",
                  content: "Just participated in my first Cal Hacks hackathon. Amazing experience! Highly recommend.",
                  upvotes: 234,
                  comments: 45
                }
              ]
            }
          }
        ]
      };
    
    default:
      return { recommendations: [] };
  }
} 
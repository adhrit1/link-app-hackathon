"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, GraduationCap, Bot, CheckCircle, Home, Briefcase, Users, Utensils, Heart, Shield, Bus, Wallet, Store, DollarSign } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  type: string;
}

interface AIQuestion {
  id: string;
  question: string;
  type: string;
}

interface Recommendation {
  title: string;
  description: string;
  score?: number;
  why_perfect?: string[];
  student_quotes?: any[];
  [key: string]: any;
}

// Module configuration
const MODULE_CONFIG = {
  enrollment: {
    title: "Course Enrollment",
    description: "AI-powered course recommendations based on your preferences",
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  dorm: {
    title: "Dorm & Housing",
    description: "Find your perfect housing match with AI insights",
    icon: Home,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  job: {
    title: "Jobs & Internships",
    description: "Discover opportunities that match your career goals",
    icon: Briefcase,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  clubs: {
    title: "Student Organizations",
    description: "Find clubs and organizations that match your interests",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  dining: {
    title: "Dining & Food",
    description: "Discover the best dining options on and around campus",
    icon: Utensils,
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  health: {
    title: "Health & Fitness",
    description: "Find fitness facilities and wellness resources",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  safety: {
    title: "Campus Safety",
    description: "Stay informed about campus safety and emergency resources",
    icon: Shield,
    color: "text-gray-600",
    bgColor: "bg-gray-50"
  },
  transportation: {
    title: "Transportation",
    description: "Plan your commute and find transportation options",
    icon: Bus,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  financial: {
    title: "Financial Management",
    description: "Budget tracking, financial aid, and payment plans",
    icon: Wallet,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  community: {
    title: "Community",
    description: "Volunteer opportunities and student organizations",
    icon: Users,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50"
  },
  marketplace: {
    title: "Marketplace",
    description: "Buy, sell, and trade with fellow students",
    icon: Store,
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  wallet: {
    title: "Student Wallet",
    description: "Digital ID, Bear Bucks, and payment management",
    icon: Wallet,
    color: "text-lime-600",
    bgColor: "bg-lime-50"
  },
  "quick-cash": {
    title: "Quick Cash",
    description: "Find gigs and quick money opportunities",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50"
  }
};

export default function ModulePage() {
  const params = useParams();
  const moduleName = params.module as string;
  const moduleConfig = MODULE_CONFIG[moduleName as keyof typeof MODULE_CONFIG];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
  const [allQuestions, setAllQuestions] = useState<(Question | AIQuestion)[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'initial' | 'ai' | 'recommendations'>('initial');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (moduleName) {
      loadQuestions();
    }
  }, [moduleName]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/modules/${moduleName}`);
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      const data = await response.json();
      setQuestions(data.questions);
      setAllQuestions(data.questions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load questions');
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: string | number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId.toString()]: answer
    }));
  };

  const handleNext = async () => {
    if (currentStep < allQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitCurrentPhase();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitCurrentPhase = async () => {
    setIsSubmitting(true);
    try {
      if (phase === 'initial') {
        const response = await fetch(`/api/modules/${moduleName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses: Object.entries(answers).map(([id, answer]) => ({
              question_id: id,
              answer: answer
            }))
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit initial questions');
        }

        const data = await response.json();
        setAiQuestions(data.ai_questions);
        setAllQuestions([...questions, ...data.ai_questions]);
        setPhase('ai');
        setCurrentStep(questions.length);
      } else if (phase === 'ai') {
        const response = await fetch(`/api/modules/${moduleName}/ai-questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses: Object.entries(answers).map(([id, answer]) => ({
              question_id: id,
              answer: answer
            }))
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit AI questions');
        }

        const data = await response.json();
        setRecommendations(data.recommendations.recommendations || []);
        setPhase('recommendations');
      }
    } catch (error) {
      console.error('Error submitting questions:', error);
      setError('Failed to submit questions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question | AIQuestion) => {
    const isAIQuestion = 'id' in question && typeof question.id === 'string';
    const IconComponent = moduleConfig?.icon || GraduationCap;
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            {isAIQuestion ? (
              <>
                <Bot className="h-5 w-5 text-blue-600" />
                <Badge variant="secondary">AI-Powered Question</Badge>
              </>
            ) : (
              <>
                <IconComponent className={`h-5 w-5 ${moduleConfig?.color}`} />
                <Badge variant="outline">Initial Question</Badge>
              </>
            )}
          </div>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === 'multiple_choice' && 'options' in question && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[question.id] === option ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4 text-left"
                  onClick={() => handleAnswer(question.id, option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
          {question.type === 'text' && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Type your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  const renderRecommendations = () => {
    const IconComponent = moduleConfig?.icon || CheckCircle;
    
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconComponent className={`h-6 w-6 ${moduleConfig?.color}`} />
              <CardTitle className="text-2xl">Your Personalized {moduleConfig?.title} Recommendations</CardTitle>
            </div>
            <CardDescription>
              Based on your preferences and AI analysis, here are the best options for you
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          {recommendations.map((recommendation, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{recommendation.title || recommendation.name || recommendation.code}</CardTitle>
                    <CardDescription className="mt-2">
                      {recommendation.description}
                      {recommendation.department && ` • ${recommendation.department}`}
                      {recommendation.units && ` • ${recommendation.units} units`}
                      {recommendation.professor && ` • Prof. ${recommendation.professor}`}
                      {recommendation.location && ` • ${recommendation.location}`}
                    </CardDescription>
                  </div>
                  {recommendation.score && (
                    <Badge variant="secondary">
                      Score: {recommendation.score}
                    </Badge>
                  )}
                  {recommendation.rmp_rating && (
                    <Badge variant="secondary">
                      ⭐ {recommendation.rmp_rating}/5.0 RMP
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {recommendation.description && (
                  <p className="text-gray-700 mb-4">{recommendation.description}</p>
                )}
                
                {recommendation.why_perfect && recommendation.why_perfect.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Why this matches you:</h4>
                    <ul className="space-y-1">
                      {recommendation.why_perfect.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendation.student_quotes && recommendation.student_quotes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Student Reviews:</h4>
                    <div className="space-y-2">
                      {recommendation.student_quotes.slice(0, 2).map((quote, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700 italic">"{quote.quote}"</p>
                          <p className="text-xs text-gray-500 mt-1">- {quote.source}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recommendation.requirements_fulfilled && recommendation.requirements_fulfilled.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Requirements fulfilled:</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.requirements_fulfilled.map((req, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button className="w-full">
                  {moduleName === 'enrollment' ? `Enroll in ${recommendation.code}` : 
                   moduleName === 'dorm' ? 'Apply for Housing' :
                   moduleName === 'job' ? 'Apply Now' :
                   moduleName === 'clubs' ? 'Join Organization' :
                   'Learn More'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (!moduleConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Module not found</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading {moduleConfig.title.toLowerCase()} questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadQuestions}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (phase === 'recommendations') {
    return (
      <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
        <div className="container mx-auto px-4">
          {renderRecommendations()}
        </div>
      </div>
    );
  }

  const currentQuestion = allQuestions[currentStep];
  const progress = ((currentStep + 1) / allQuestions.length) * 100;
  const IconComponent = moduleConfig.icon;

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <IconComponent className={`h-8 w-8 ${moduleConfig.color}`} />
            <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
          </div>
          <p className="text-gray-600">{moduleConfig.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {allQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${moduleConfig.color.replace('text-', 'bg-')}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          {currentQuestion && renderQuestion(currentQuestion)}
        </div>

        {/* Navigation */}
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion?.id] || isSubmitting}
            className={moduleConfig.color.replace('text-', 'bg-').replace('-600', '-500')}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : currentStep === allQuestions.length - 1 ? (
              'Get Recommendations'
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Briefcase, Bot, CheckCircle, ArrowLeft, ArrowRight, Linkedin, Users, DollarSign } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  type: string;
  multi_select?: boolean;
}

interface AIQuestion {
  id: string;
  question: string;
  type: string;
}

interface Recommendation {
  title: string;
  description: string;
  company?: string;
  location?: string;
  salary?: string;
  jobType?: string;
  score?: number;
  why_perfect?: string[];
  student_quotes?: any[];
  alumniMentor?: any;
  [key: string]: any;
}

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function JobQuiz({ moduleConfig }: { moduleConfig: ModuleConfig }) {
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/modules/job`);
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      const data = await response.json();
      const questionsWithMulti = data.questions.map((q: Question) => ({
        ...q,
        multi_select: /type of|activities|select all|which of/i.test(q.question)
      }));
      setQuestions(questionsWithMulti);
      setAllQuestions(questionsWithMulti);
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

  const handleMultiSelect = (questionId: string | number, option: string) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId];
      const prevArr = Array.isArray(currentAnswers) ? currentAnswers : [];
      
      if (prevArr.includes(option)) {
        const newArr = prevArr.filter((o: string) => o !== option);
        return {
          ...prev,
          [questionId]: newArr
        };
      } else {
        const newArr = [...prevArr, option];
        return {
          ...prev,
          [questionId]: newArr
        };
      }
    });
  };

  const handleNext = async () => {
    const currentQuestion = allQuestions[currentStep];
    const currentAnswer = answers[currentQuestion.id];
    
    const isMultiSelect = !('id' in currentQuestion && typeof currentQuestion.id === 'string') && 
                         'multi_select' in currentQuestion && 
                         (currentQuestion as Question).multi_select;
    
    let hasAnswer = false;
    
    if (isMultiSelect) {
      hasAnswer = Array.isArray(currentAnswer) && currentAnswer.length > 0;
    } else {
      hasAnswer = currentAnswer !== undefined && 
                  currentAnswer !== '' && 
                  currentAnswer !== null;
    }
    
    if (!hasAnswer) {
      setError('Please answer the current question before proceeding.');
      return;
    }
    
    setError(null);
    
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
        const response = await fetch(`/api/modules/job`, {
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
        const response = await fetch(`/api/modules/job`, {
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

  const handleLogin = (platform: 'handshake' | 'linkedin') => {
    // Simulate login process
    setIsLoggedIn(true);
    console.log(`Logging into ${platform}...`);
  };

  const renderQuestion = (question: Question | AIQuestion) => {
    const isAIQuestion = 'id' in question && typeof question.id === 'string';
    const multiSelect = !isAIQuestion && 'multi_select' in question && (question as Question).multi_select;
    
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
                <Briefcase className="h-5 w-5 text-purple-600" />
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
                  variant={multiSelect
                    ? (Array.isArray(answers[question.id]) && answers[question.id].includes(option) ? "default" : "outline")
                    : (answers[question.id] === option ? "default" : "outline")}
                  className="w-full justify-start h-auto p-4 text-left"
                  onClick={() => multiSelect ? handleMultiSelect(question.id, option) : handleAnswer(question.id, option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
          {question.type === 'text' && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-2xl">Your Perfect Job Matches</CardTitle>
            </div>
            <CardDescription>
              Based on your preferences and AI analysis, here are the best opportunities for you
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Login Section */}
        {!isLoggedIn && (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Professional Profiles</CardTitle>
              <CardDescription>
                Connect your Handshake and LinkedIn accounts for personalized job recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  onClick={() => handleLogin('handshake')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Connect Handshake
                </Button>
                <Button 
                  onClick={() => handleLogin('linkedin')}
                  className="flex-1 bg-blue-700 hover:bg-blue-800"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  Connect LinkedIn
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {recommendations.map((recommendation, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{recommendation.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {recommendation.company && `${recommendation.company}`}
                      {recommendation.location && ` • ${recommendation.location}`}
                      {recommendation.jobType && ` • ${recommendation.jobType}`}
                      {recommendation.salary && ` • ${recommendation.salary}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {recommendation.score && (
                      <Badge variant="secondary">
                        Match Score: {recommendation.score}
                      </Badge>
                    )}
                    {recommendation.salary && (
                      <Badge variant="outline" className="text-green-600">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {recommendation.salary}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {recommendation.description && (
                  <p className="text-gray-700 mb-4">{recommendation.description}</p>
                )}
                
                {recommendation.why_perfect && recommendation.why_perfect.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Why this job matches you:</h4>
                    <ul className="space-y-1">
                      {recommendation.why_perfect.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
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

                {recommendation.alumniMentor && (
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      Alumni Mentor Available
                    </h4>
                    <p className="text-sm text-gray-700">
                      {recommendation.alumniMentor.name} - {recommendation.alumniMentor.title} at {recommendation.alumniMentor.company}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Available for coffee chat: {recommendation.alumniMentor.availability}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Schedule Coffee Chat
                    </Button>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Similar Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Tracking */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Application Timeline Tracker</CardTitle>
            <CardDescription>
              Track your job applications and interview progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-600">Applications</h4>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Submitted</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold text-yellow-600">Interviews</h4>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold text-green-600">Offers</h4>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-gray-600">Received</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-600">Mentors</h4>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading job questions...</p>
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

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="h-8 w-8 text-purple-600" />
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
              className="h-2 rounded-full transition-all duration-300 bg-purple-600"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          {currentQuestion && renderQuestion(currentQuestion)}
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : currentStep === allQuestions.length - 1 ? (
              <>
                Get Recommendations
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 
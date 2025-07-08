"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Briefcase, Bot, CheckCircle, ArrowLeft, ArrowRight, Users, Star, Search, X, ChevronDown, ChevronUp, Heart, MessageCircle, MapPin, DollarSign, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Question {
  id: number;
  question: string;
  options: string[];
  type: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  score: number;
  why_perfect: string[];
  student_quotes: Array<{
    quote: string;
    source: string;
  }>;
  alumniMentor?: {
    name: string;
    title: string;
    company: string;
    availability: string;
  };
  also_liked: string[];
  reddit_data?: {
    posts: Array<{
      title: string;
      content: string;
      upvotes: number;
      comments: number;
    }>;
  };
  requirements?: string[];
  application_deadline?: string;
  remote_option?: boolean;
}

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function JobsQuiz({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'quiz' | 'ai_questions' | 'recommendations'>('quiz');
  const [aiQuestions, setAiQuestions] = useState<Question[]>([]);
  const [aiAnswers, setAiAnswers] = useState<Record<string, any>>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      setQuestions(data.questions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load questions');
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentStep];
    const currentAnswer = answers[currentQuestion.id];
    
    if (!currentAnswer) {
      setError('Please answer the current question before proceeding.');
      return;
    }
    
    setError(null);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitInitialQuestions();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitInitialQuestions = async () => {
    setIsSubmitting(true);
    try {
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
        throw new Error('Failed to submit questions');
      }

      const data = await response.json();
      setAiQuestions(data.ai_questions || []);
      setPhase('ai_questions');
    } catch (error) {
      console.error('Error submitting questions:', error);
      setError('Failed to submit questions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIAnswer = (questionId: string, answer: string) => {
    setAiAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitAIQuestions = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/modules/job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: Object.entries(aiAnswers).map(([id, answer]) => ({
            question_id: id,
            answer: answer
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit AI questions');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setPhase('recommendations');
    } catch (error) {
      console.error('Error submitting AI questions:', error);
      setError('Failed to submit AI questions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecommendationSelection = (id: string) => {
    setSelectedRecommendations(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const toggleRecommendationExpansion = (id: string) => {
    setExpandedRecommendation(prev => prev === id ? null : id);
  };

  const handleSwipeToSearch = (id: string) => {
    setSearchMode(id);
    setSearchQuery("");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Simulate search results
      const searchResults: Recommendation[] = [
        {
          id: "search_1",
          title: `Search Result: ${searchQuery}`,
          description: `Custom search result for "${searchQuery}"`,
          company: "Search Results",
          location: "Various",
          salary: "TBD",
          jobType: "Search Result",
          score: 85,
          why_perfect: [`Matches your search: "${searchQuery}"`],
          student_quotes: [
            {
              quote: `Search result for "${searchQuery}"`,
              source: "Custom Search"
            }
          ],
          also_liked: ["Other search results"]
        }
      ];
      
      setRecommendations(searchResults);
      setSearchMode(null);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Failed to search. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApply = () => {
    alert(`Applying to ${selectedRecommendations.length} selected jobs!`);
    // Here you would implement actual application logic
  };

  const renderQuestion = (question: Question) => {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <Badge variant="outline">Question {currentStep + 1} of {questions.length}</Badge>
          </div>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === 'multiple_choice' && (
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
        </CardContent>
      </Card>
    );
  };

  const renderAIQuestions = () => {
    return (
      <div className="space-y-6">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-purple-600" />
              <Badge variant="outline">Personalized Follow-up Questions</Badge>
            </div>
            <CardDescription>
              Let's get more specific to provide better job recommendations
            </CardDescription>
          </CardHeader>
        </Card>
        
        {aiQuestions.map((question, index) => (
          <Card key={question.id} className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Question {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{question.question}</p>
              <Input
                placeholder="Type your answer..."
                value={aiAnswers[question.id] || ""}
                onChange={(e) => handleAIAnswer(question.id.toString(), e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>
        ))}
        
        <div className="flex justify-between max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setPhase('quiz')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz
          </Button>
          
          <Button
            onClick={submitAIQuestions}
            disabled={isSubmitting || aiQuestions.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Get Recommendations
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    return (
      <div className="space-y-6">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-600" />
              <Badge variant="outline">Personalized Recommendations</Badge>
            </div>
            <CardTitle className="text-2xl">Your Perfect Job Matches</CardTitle>
            <CardDescription>
              Based on your preferences, here are 5 job opportunities we think you'll love
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4 max-w-4xl mx-auto">
          {recommendations.map((rec, index) => (
            <Card key={rec.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-sm">
                        #{index + 1}
                      </Badge>
                      <CardTitle className="text-xl">{rec.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{rec.score}/100</span>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {rec.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{rec.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{rec.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{rec.jobType}</span>
                      </div>
                      {rec.remote_option && (
                        <Badge variant="outline" className="text-xs">
                          Remote Available
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-medium text-gray-700">{rec.company}</span>
                      {rec.application_deadline && (
                        <Badge variant="secondary" className="text-xs">
                          Apply by {rec.application_deadline}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleRecommendationExpansion(rec.id)}
                    >
                      {expandedRecommendation === rec.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwipeToSearch(rec.id)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant={selectedRecommendations.includes(rec.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleRecommendationSelection(rec.id)}
                    >
                      {selectedRecommendations.includes(rec.id) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedRecommendation === rec.id && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">Why This Job is Perfect for You</h4>
                      <ul className="space-y-1">
                        {rec.why_perfect.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-purple-600 mb-2">Student Reviews</h4>
                      <div className="space-y-2">
                        {rec.student_quotes.map((quote, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm italic">"{quote.quote}"</p>
                            <p className="text-xs text-gray-500 mt-1">— {quote.source}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {rec.alumniMentor && (
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Alumni Mentor Available</h4>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{rec.alumniMentor.name}</p>
                            <p className="text-sm text-gray-600">
                              {rec.alumniMentor.title} at {rec.alumniMentor.company}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {rec.alumniMentor.availability}
                            </p>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Students who liked this also liked:</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.also_liked.map((job, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {job}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {rec.reddit_data && (
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2">Reddit Discussions</h4>
                      <div className="space-y-2">
                        {rec.reddit_data.posts.map((post, idx) => (
                          <div key={idx} className="bg-orange-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageCircle className="h-3 w-3 text-orange-600" />
                              <span className="text-xs font-medium">{post.title}</span>
                            </div>
                            <p className="text-xs text-gray-700">{post.content.substring(0, 100)}...</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>↑ {post.upvotes}</span>
                              <span>💬 {post.comments}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {rec.requirements && (
                    <div>
                      <h4 className="font-semibold text-gray-600 mb-2">Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.requirements.map((req, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {searchMode && (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                <CardTitle>Search for Alternatives</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchMode(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search for specific jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="text-sm text-gray-600">
            Selected: {selectedRecommendations.length}/5 jobs
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPhase('ai_questions')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Button>
            
            <Button
              onClick={handleApply}
              disabled={selectedRecommendations.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Apply to Selected ({selectedRecommendations.length})
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading job assessment...</p>
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

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        {phase === 'quiz' && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
              </div>
              <p className="text-gray-600">{moduleConfig.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300 bg-blue-600"
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : currentStep === questions.length - 1 ? (
                  <>
                    Continue to AI Questions
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
          </>
        )}

        {phase === 'ai_questions' && renderAIQuestions()}
        {phase === 'recommendations' && renderRecommendations()}
      </div>
    </div>
  );
} 
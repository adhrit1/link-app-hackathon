"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Bot, CheckCircle, ArrowLeft, ArrowRight, Users, Star, Search, X, ChevronDown, ChevronUp, Heart, MessageCircle, ExternalLink, Check, Sparkles, Target, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Question {
  id: number;
  question: string;
  options: string[];
  type: string;
  multi_select?: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  code: string;
  department: string;
  units: number;
  professor: string;
  score: number;
  rmp_rating: number;
  why_perfect: string[];
  student_quotes: Array<{
    quote: string;
    source: string;
    rating: number;
  }>;
  requirements_fulfilled: string[];
  also_liked: string[];
  reddit_data?: {
    posts: Array<{
      title: string;
      content: string;
      upvotes: number;
      comments: number;
    }>;
  };
  enrollment_status?: "Open" | "Waitlist" | "Closed";
  difficulty_rating?: number;
  workload_hours?: number;
}

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function EnrollmentQuiz({ moduleConfig }: { moduleConfig: ModuleConfig }) {
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

  // This is a freshman portal - no need to ask about academic standing

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/modules/enrollment`);
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
    const currentQuestion = questions.find(q => q.id === questionId);
    
    if (currentQuestion?.multi_select) {
      // Handle multi-select
      setAnswers(prev => {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(answer)
          ? currentAnswers.filter(a => a !== answer)
          : [...currentAnswers, answer];
        return {
          ...prev,
          [questionId]: newAnswers
        };
      });
    } else {
      // Handle single select
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    }
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentStep];
    const currentAnswer = answers[currentQuestion.id];
    
    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
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
      const response = await fetch(`/api/modules/enrollment`, {
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
      setAiQuestions(data.follow_up_questions || []);
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
      const response = await fetch(`/api/modules/enrollment`, {
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
        throw new Error('Failed to submit personalized questions');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setPhase('recommendations');
    } catch (error) {
      console.error('Error submitting AI questions:', error);
      setError('Failed to submit personalized questions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecommendationSelection = (id: string) => {
    setSelectedRecommendations(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id)
        : prev.length < 5 
          ? [...prev, id]
          : prev
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
      const response = await fetch(`/api/modules/enrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: searchQuery,
          current_recommendations: recommendations.map(r => r.id)
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setRecommendations(prev => [...prev, ...(data.recommendations || [])]);
      setSearchMode(null);
      setSearchQuery("");
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnroll = () => {
    // Handle enrollment logic
    console.log('Enrolling in:', selectedRecommendations);
  };

  const renderQuestion = (question: Question) => {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Badge variant="secondary" className="text-xs font-medium">
                    Question {currentStep + 1} of {questions.length}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(((currentStep + 1) / questions.length) * 100)}%
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {question.type === 'multiple_choice' && !question.multi_select && (
              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left group hover:shadow-md ${
                      answers[question.id] === option 
                        ? "border-blue-500 bg-blue-50 shadow-lg" 
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        answers[question.id] === option 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {answers[question.id] === option && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="flex-1 text-lg font-medium text-gray-800">{option}</span>
                      {answers[question.id] === option && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {question.type === 'multiple_choice' && question.multi_select && (
              <div className="space-y-4">
                {question.options.map((option, index) => {
                  const currentAnswers = answers[question.id] || [];
                  const isSelected = currentAnswers.includes(option);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(question.id, option)}
                      className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left group hover:shadow-md ${
                        isSelected 
                          ? "border-purple-500 bg-purple-50 shadow-lg" 
                          : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected 
                            ? 'bg-purple-500 border-purple-500' 
                            : 'border-gray-300 group-hover:border-purple-400'
                        }`}>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-white" />
                          )}
                        </div>
                        <span className="flex-1 text-lg font-medium text-gray-800">{option}</span>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
                <p className="text-sm text-gray-500 mt-4 italic text-center">
                  💡 Select all options that apply to you
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAIQuestions = () => {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Personalized Questions</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Let's dive deeper to create your perfect course recommendations
          </p>
        </div>
        
        {/* Questions */}
        <div className="space-y-6">
          {aiQuestions.map((question, index) => (
            <Card key={question.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Question {index + 1}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">{question.question}</p>
                <Input
                  placeholder="Share your thoughts..."
                  value={aiAnswers[question.id] || ""}
                  onChange={(e) => handleAIAnswer(question.id.toString(), e.target.value)}
                  className="w-full h-16 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl px-4"
                />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button
            variant="outline"
            onClick={() => setPhase('quiz')}
            className="px-8 py-3 text-lg rounded-xl border-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Quiz
          </Button>
          
          <Button
            onClick={submitAIQuestions}
            disabled={isSubmitting || aiQuestions.length === 0}
            className="px-8 py-3 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Get My Recommendations
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Your Perfect Course Matches</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Based on your preferences and freshman status, here are the courses we think you'll love
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Selected: {selectedRecommendations.length}/5 courses
            </Badge>
            <Badge variant="outline" className="text-sm">
              Freshman Focused
            </Badge>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid gap-6">
          {Array.isArray(recommendations) && recommendations.slice(0, 5).map((rec, index) => (
            <Card key={rec.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                          {rec.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-semibold">{rec.code}</span>
                          <span>{rec.department}</span>
                          <span>{rec.units} units</span>
                          <span>Prof. {rec.professor}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{rec.rmp_rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{rec.score}</div>
                          <div className="text-sm text-gray-500">Match Score</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRecommendationSelection(rec.id)}
                          className={`rounded-full w-12 h-12 p-0 ${
                            selectedRecommendations.includes(rec.id)
                              ? 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600'
                              : 'hover:border-blue-300'
                          }`}
                        >
                          {selectedRecommendations.includes(rec.id) ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Heart className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-lg text-gray-700 leading-relaxed">
                      {rec.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => toggleRecommendationExpansion(rec.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {expandedRecommendation === rec.id ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Show More Details
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSwipeToSearch(rec.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find Alternatives
                  </Button>
                </div>

                {expandedRecommendation === rec.id && (
                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    {/* Professor & Course Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Professor Rating
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-blue-600">{rec.rmp_rating}</span>
                          <span className="text-sm text-gray-600">/ 5.0</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Rate My Professor</p>
                      </div>
                      
                      {rec.difficulty_rating && (
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-500" />
                            Difficulty Level
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-orange-600">{rec.difficulty_rating}</span>
                            <span className="text-sm text-gray-600">/ 5.0</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Student Reported</p>
                        </div>
                      )}
                      
                      {rec.workload_hours && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-green-500" />
                            Weekly Workload
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">{rec.workload_hours}</span>
                            <span className="text-sm text-gray-600">hours/week</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Average Student Report</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Why This Course is Perfect for You
                      </h4>
                      <div className="grid gap-2">
                        {rec.why_perfect.map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {rec.student_quotes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-green-500" />
                          What Students Say
                        </h4>
                        <div className="space-y-3">
                          {rec.student_quotes.map((quote, idx) => (
                            <div key={idx} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                              <p className="text-gray-700 italic mb-2">"{quote.quote}"</p>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">— {quote.source}</p>
                                {quote.rating > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-sm text-gray-600">{quote.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {rec.reddit_data && rec.reddit_data.posts.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-red-500" />
                          Reddit Discussions
                        </h4>
                        <div className="space-y-3">
                          {rec.reddit_data.posts.slice(0, 2).map((post, idx) => (
                            <div key={idx} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                              <h5 className="font-medium text-gray-900 mb-2">{post.title}</h5>
                              <p className="text-gray-700 text-sm mb-2">{post.content.substring(0, 150)}...</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>↑ {post.upvotes} upvotes</span>
                                <span>💬 {post.comments} comments</span>
                                <span>r/berkeley</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Requirements Fulfilled</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.requirements_fulfilled.map((req, idx) => (
                          <Badge key={idx} variant="secondary" className="text-sm">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {rec.also_liked.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Students Also Liked</h4>
                        <div className="flex flex-wrap gap-2">
                          {rec.also_liked.map((course, idx) => (
                            <Badge key={idx} variant="outline" className="text-sm">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Section */}
        {searchMode && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-blue-600" />
                  <CardTitle>Search for Alternatives</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchMode(null)}
                  className="rounded-full w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Search for specific courses, topics, or professors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSubmitting}
                  className="h-12 px-6 bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
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

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button
            variant="outline"
            onClick={() => setPhase('ai_questions')}
            className="px-8 py-3 text-lg rounded-xl border-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Questions
          </Button>
          
          <Button
            onClick={handleEnroll}
            disabled={selectedRecommendations.length === 0}
            className="px-8 py-3 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl shadow-lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Enroll in Selected ({selectedRecommendations.length})
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your enrollment assessment...</h3>
          <p className="text-gray-600">Preparing personalized questions for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadQuestions} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {phase === 'quiz' && (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">{moduleConfig.title}</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
                {moduleConfig.description}
              </p>
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg">
                <Target className="h-4 w-4 mr-2" />
                Onboard Now
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span className="font-semibold">Question {currentStep + 1} of {questions.length}</span>
                <span className="font-semibold">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className="h-4 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Getting Started</span>
                <span>Personalized Recommendations</span>
              </div>
            </div>

            {/* Question */}
            <div className="mb-12">
              {currentQuestion && renderQuestion(currentQuestion)}
            </div>

            {/* Error Display */}
            {error && (
              <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="max-w-3xl mx-auto flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-8 py-3 text-lg rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : currentStep === questions.length - 1 ? (
                  <>
                    Continue to Personalized Questions
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-5 w-5 ml-2" />
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
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Home, Bot, ArrowLeft, ArrowRight } from "lucide-react";

interface Question {
  id: number | string;
  question: string;
  options?: string[];
  type: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  reddit_posts: Array<{ title: string; upvotes: number; comments: number }>;
}

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function OnboardingQuiz({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [aiQuestions, setAiQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [phase, setPhase] = useState<'initial' | 'ai' | 'recommendations'>('initial');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [rankings, setRankings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('freshmanFlowResults');
    if (saved) {
      setRecommendations(JSON.parse(saved));
      setPhase('recommendations');
      setIsLoading(false);
    } else {
      loadQuestions();
    }
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      // Request the initial onboarding questions
      const res = await fetch('/api/onboarding')
      if (!res.ok) throw new Error('Failed to load questions');
      const data = await res.json();
      setQuestions(data.questions);
      setAllQuestions(data.questions);
      setIsLoading(false);
    } catch (e) {
      console.error('Error loading questions:', e);
      setError('Failed to load questions');
      setIsLoading(false);
    }
  };

  const handleAnswer = (id: number | string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = async () => {
    const currentQuestion = allQuestions[currentStep];
    const currentAnswer = answers[currentQuestion.id];
    if (!currentAnswer) {
      setError('Please answer the current question.');
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
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const submitCurrentPhase = async () => {
    setIsSubmitting(true);
    try {
      if (phase === 'initial') {
        // Submit initial answers to fetch AI follow-up questions
        const res = await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            responses: Object.entries(answers).map(([id, answer]) => ({
              question_id: id,
              answer
            }))
          })
        });
        if (!res.ok) throw new Error('Failed to submit initial questions');
        const data = await res.json();
        setAiQuestions(data.ai_questions);
        setAllQuestions([...questions, ...data.ai_questions]);
        setPhase('ai');
        setCurrentStep(questions.length);
      } else if (phase === 'ai') {
        const res = await fetch('/api/onboarding/ai-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            responses: Object.entries(answers).map(([id, answer]) => ({
              question_id: id,
              answer
            }))
          })
        });
        if (!res.ok) throw new Error('Failed to submit AI questions');
        const data = await res.json();
        setRecommendations(data.recommendations);
        localStorage.setItem('freshmanFlowResults', JSON.stringify(data.recommendations));
        setPhase('recommendations');
      }
    } catch (e) {
      console.error('Error submitting questions:', e);
      setError('Failed to submit questions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRanking = (id: string) => {
    setRankings(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const renderQuestion = (q: Question) => {
    const isAI = typeof q.id === 'string';
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            {isAI ? <Bot className="h-5 w-5 text-teal-600" /> : <Home className="h-5 w-5 text-teal-600" />}
            <Badge variant={isAI ? 'secondary' : 'outline'}>
              {isAI ? 'Follow-up Question' : 'Initial Question'}
            </Badge>
          </div>
          <CardTitle className="text-xl">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {q.type === 'multiple_choice' && q.options?.map((opt, idx) => (
            <Button
              key={idx}
              variant={answers[q.id] === opt ? 'default' : 'outline'}
              className="w-full justify-start h-auto p-4 text-left"
              onClick={() => handleAnswer(q.id, opt)}
            >
              {opt}
            </Button>
          ))}
          {q.type === 'text' && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
              rows={4}
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  const renderRecommendations = () => (
    <div className="space-y-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-teal-600" />
            <CardTitle>Dorm Recommendations</CardTitle>
          </div>
          <CardDescription>Select up to three favorites</CardDescription>
        </CardHeader>
      </Card>
      {recommendations.map(rec => {
        const rank = rankings.indexOf(rec.id);
        return (
          <Card key={rec.id} className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{rec.title}</CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
                </div>
                {rank > -1 && <Badge variant="secondary">Rank {rank + 1}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <h4 className="font-semibold">Pros</h4>
                <ul className="list-disc list-inside text-sm">
                  {rec.pros.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Cons</h4>
                <ul className="list-disc list-inside text-sm">
                  {rec.cons.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              {rec.reddit_posts.length > 0 && (
                <div>
                  <h4 className="font-semibold">Reddit Mentions</h4>
                  <ul className="list-disc list-inside text-sm">
                    {rec.reddit_posts.map((p, i) => (
                      <li key={i}>{p.title} (↑{p.upvotes})</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button onClick={() => toggleRanking(rec.id)} variant="outline">
                {rank > -1 ? 'Unrank' : rankings.length < 3 ? 'Select as Top Choice' : 'Ranking Full'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
      {rankings.length > 0 && (
        <div className="text-center">
          <Badge variant="secondary">Top choice: {rankings[0]}</Badge>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
        <div className="container mx-auto px-4">{renderRecommendations()}</div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / allQuestions.length) * 100;
  const currentQuestion = allQuestions[currentStep];

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Home className="h-8 w-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
          </div>
          <p className="text-gray-600">{moduleConfig.description}</p>
        </div>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {allQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-teal-600"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="mb-8">{currentQuestion && renderQuestion(currentQuestion)}</div>
        {error && (
          <div className="max-w-2xl mx-auto mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          </div>
        )}
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
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
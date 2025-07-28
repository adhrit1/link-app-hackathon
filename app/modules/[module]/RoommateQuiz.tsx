"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface StudentProfile {
  id: string;
  name: string;
  photo: string;
  bio: string;
  sleep: string;
  social: string;
  noise: string;
}

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "When do you usually go to bed?",
    options: ["Early to bed", "Night owl", "Flexible"],
  },
  {
    id: 2,
    question: "How social are you?",
    options: ["Very social", "Moderately social", "Prefer quiet"],
  },
  {
    id: 3,
    question: "What's your noise tolerance?",
    options: ["Need silence", "Can handle some noise", "Noisy environment is fine"],
  },
];

const STUDENTS: StudentProfile[] = [
  {
    id: "alice",
    name: "Alice Johnson",
    photo: "/placeholder-avatar.jpg",
    bio: "Biology major who loves hiking and cooking.",
    sleep: "Early to bed",
    social: "Moderately social",
    noise: "Need silence",
  },
  {
    id: "brian",
    name: "Brian Lee",
    photo: "/placeholder-avatar.jpg",
    bio: "CS major, avid gamer and basketball fan.",
    sleep: "Night owl",
    social: "Very social",
    noise: "Noisy environment is fine",
  },
  {
    id: "catherine",
    name: "Catherine Lopez",
    photo: "/placeholder-avatar.jpg",
    bio: "English major, enjoys reading and writing.",
    sleep: "Flexible",
    social: "Prefer quiet",
    noise: "Can handle some noise",
  },
];

function calculateCompatibility(answers: Record<number, string>, student: StudentProfile) {
  let match = 0;
  if (answers[1] === student.sleep) match++;
  if (answers[2] === student.social) match++;
  if (answers[3] === student.noise) match++;
  return Math.round((match / 3) * 100);
}

export function RoommateQuiz({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [phase, setPhase] = useState<'quiz' | 'results'>('quiz');
  const [shortlist, setShortlist] = useState<string[]>([]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem('roommateQuizAnswers');
    const savedShortlist = localStorage.getItem('roommateQuizShortlist');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
      if (savedShortlist) setShortlist(JSON.parse(savedShortlist));
      setPhase('results');
    }
  }, []);
  const handleAnswer = (id: number, option: string) => {
    setAnswers(prev => ({ ...prev, [id]: option }));
  };

  const handleNext = () => {
    const currentQuestion = QUESTIONS[step];
    if (!answers[currentQuestion.id]) return;

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('roommateQuizAnswers', JSON.stringify(answers));
      if (shortlist.length > 0) {
        localStorage.setItem('roommateQuizShortlist', JSON.stringify(shortlist));
      }
      setPhase('results');
    }
  };

  const toggleShortlist = (id: string) => {
    setShortlist(prev => {
      const updated = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      localStorage.setItem('roommateQuizShortlist', JSON.stringify(updated));
      return updated;
    });
  };

  const renderQuestion = (q: Question) => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <Badge variant="outline">Question {q.id}</Badge>
        <CardTitle className="text-xl mt-2">{q.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {q.options.map(opt => (
          <Button
            key={opt}
            variant={answers[q.id] === opt ? 'default' : 'outline'}
            className="w-full justify-start h-auto p-4 text-left"
            onClick={() => handleAnswer(q.id, opt)}
          >
            {opt}
          </Button>
        ))}
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    const ranked = STUDENTS.map(s => ({
      ...s,
      compatibility: calculateCompatibility(answers, s),
    })).sort((a, b) => b.compatibility - a.compatibility);

    return (
      <div className="space-y-6">
        {ranked.map(student => (
          <Card key={student.id} className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Image src={student.photo} alt={student.name} width={64} height={64} className="rounded-full" />
                <div>
                  <CardTitle>{student.name}</CardTitle>
                  <CardDescription>{student.compatibility}% compatibility</CardDescription>
                </div>
                <Button
                  variant={shortlist.includes(student.id) ? 'default' : 'outline'}
                  className="ml-auto"
                  onClick={() => toggleShortlist(student.id)}
                >
                  {shortlist.includes(student.id) ? 'Shortlisted' : 'Like'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{student.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (phase === 'results') {
    return (
      <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
        <div className="container mx-auto px-4 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Potential Roommates</h1>
          </div>
          {renderResults()}
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
          <p className="text-gray-600">{moduleConfig.description}</p>
        </div>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {step + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="mb-8">{renderQuestion(q)}</div>
        <div className="max-w-2xl mx-auto flex justify-end">
          <Button onClick={handleNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}
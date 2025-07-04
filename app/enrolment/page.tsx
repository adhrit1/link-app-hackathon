"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const steps = [
  { label: "Personal Info", question: "What is your full name?" },
  { label: "Contact", question: "What is your email address?" },
  { label: "Education", question: "What is your current level of education?" },
  { label: "Program", question: "Which program are you enrolling in?" },
  { label: "Confirmation", question: "Review and confirm your enrolment details." },
];

export default function EnrolmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(Array(steps.length).fill(""));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: handle form submission here
    alert("Enrolment submitted!\n" + JSON.stringify(answers, null, 2));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8">
      {/* Stepper Indicator */}
      <div className="flex mb-10 w-full max-w-lg justify-between items-center">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex-1 flex flex-col items-center">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mb-1
                ${idx === currentStep ? "bg-blue-600" : idx < currentStep ? "bg-blue-300" : "bg-gray-300"}`}
            >
              {idx + 1}
            </div>
            <span className={`text-xs text-center ${idx === currentStep ? "text-blue-600 font-semibold" : "text-gray-500"}`}>{step.label}</span>
            {idx < steps.length - 1 && (
              <div className="w-full h-1 bg-gray-200 mt-1 mb-1">
                <div className={`h-1 ${idx < currentStep ? "bg-blue-400" : "bg-gray-200"}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">{steps[currentStep].label}</h1>
        <p className="mb-6 text-gray-700 text-center">{steps[currentStep].question}</p>
        {currentStep < steps.length - 1 ? (
          <input
            type="text"
            className="mb-8 px-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={answers[currentStep]}
            onChange={handleInputChange}
            placeholder="Your answer..."
            required
          />
        ) : (
          <div className="mb-8 w-full text-left text-gray-600">
            {steps.slice(0, -1).map((step, idx) => (
              <div key={step.label} className="mb-2">
                <span className="font-semibold">{step.label}:</span> {answers[idx] || <span className="italic text-gray-400">No answer</span>}
              </div>
            ))}
          </div>
        )}
        <div className="flex w-full justify-between">
          <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
} 
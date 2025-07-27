"use client";

import { useParams } from "next/navigation";
import { EnrollmentQuiz } from "./EnrollmentQuiz";
import { DormQuiz } from "./DormQuiz";
import { JobQuiz } from "./JobQuiz";
import { CommunityQuiz } from "./CommunityQuiz";
import { OnboardingQuiz } from "./OnboardingQuiz";
import { AcademicSupportDashboard } from "./AcademicSupportDashboard";
import { HealthDashboard } from "./HealthDashboard";
import { SafetyDashboard } from "./SafetyDashboard";
import { TransportationDashboard } from "./TransportationDashboard";
import { DiningDashboard } from "./DiningDashboard";
import { MarketplaceDashboard } from "./MarketplaceDashboard";
import { WalletDashboard } from "./WalletDashboard";
import { FinancialDashboard } from "./FinancialDashboard";
import { QuickCashDashboard } from "./QuickCashDashboard";
import { ReportCardDashboard } from "./ReportCardDashboard";
import { OnCampusJobsDashboard } from "./OnCampusJobsDashboard";
import { NecessaryDocumentsDashboard } from "./NecessaryDocumentsDashboard";
import { RoommateQuiz } from "./RoommateQuiz";

// Module configuration
const MODULE_CONFIG = {
  enrollment: {
    title: "Course Enrollment",
    description: "AI-powered course recommendations based on your preferences",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  "freshman-flow": {
    title: "Freshmen Flow",
    description: "AI onboarding with dorm matching",
    color: "text-teal-600",
    bgColor: "bg-teal-50"
  },
  dorm: {
    title: "Dorm & Housing",
    description: "Find your perfect housing match with AI insights",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  "roommate-search": {
    title: "Roommate Matching",
    description: "Find compatible roommates based on lifestyle",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  job: {
    title: "Jobs & Internships",
    description: "Discover opportunities that match your career goals",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  community: {
    title: "Community",
    description: "Volunteer opportunities and student organizations",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50"
  },
  "academic-support": {
    title: "Academic Support",
    description: "Get help with studies, tutoring, Canvas integration, and Ed Discussion",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  health: {
    title: "Health & Fitness",
    description: "Find fitness facilities and wellness resources",
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  safety: {
    title: "Campus Safety",
    description: "Stay informed about campus safety and emergency resources",
    color: "text-gray-600",
    bgColor: "bg-gray-50"
  },
  transportation: {
    title: "Transportation",
    description: "Plan your commute and find transportation options",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  dining: {
    title: "Dining & Food",
    description: "Discover the best dining options on and around campus",
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  marketplace: {
    title: "Marketplace",
    description: "Buy, sell, and trade with fellow students",
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  wallet: {
    title: "Student Wallet",
    description: "Digital ID, Bear Bucks, and payment management",
    color: "text-lime-600",
    bgColor: "bg-lime-50"
  },
  financial: {
    title: "Financial Management",
    description: "Budget tracking, financial aid, and payment plans",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  "quick-cash": {
    title: "Quick Cash",
    description: "Find gigs and quick money opportunities",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  "grades": {
    title: "Digital Report Card",
    description: "Track your grades, GPA, and academic progress",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  "on-campus-jobs": {
    title: "On-Campus Jobs",
    description: "Find on-campus and part-time job opportunities",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  "necessary-documents": {
    title: "Necessary Documents",
    description: "Important forms, documents, and resources for students",
    color: "text-gray-600",
    bgColor: "bg-gray-50"
  }
};

// Quiz modules that use the quiz/AI/recommendation flow
const QUIZ_MODULES = ["enrollment", "freshman-flow", "dorm", "job", "community", "roommate-search"];

export default function ModulePage() {
  const params = useParams();
  const moduleName = params.module as string;
  const moduleConfig = MODULE_CONFIG[moduleName as keyof typeof MODULE_CONFIG];

  if (!moduleConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Module not found</p>
        </div>
      </div>
    );
  }

  // Route to the appropriate component based on module type
  switch (moduleName) {
    // Quiz modules - use quiz/AI/recommendation flow
    case "enrollment":
      return <EnrollmentQuiz moduleConfig={moduleConfig} />;
    case "freshman-flow":
      return <OnboardingQuiz moduleConfig={moduleConfig} />;
    case "dorm":
      return <DormQuiz moduleConfig={moduleConfig} />;
    case "job":
      return <JobQuiz moduleConfig={moduleConfig} />;
    case "roommate-search":
      return <RoommateQuiz moduleConfig={moduleConfig} />;
    case "community":
      return <CommunityQuiz moduleConfig={moduleConfig} />;
    
    // Non-quiz modules - use direct dashboard/action interfaces
    case "academic-support":
      return <AcademicSupportDashboard moduleConfig={moduleConfig} />;
    case "health":
      return <HealthDashboard moduleConfig={moduleConfig} />;
    case "safety":
      return <SafetyDashboard moduleConfig={moduleConfig} />;
    case "transportation":
      return <TransportationDashboard moduleConfig={moduleConfig} />;
    case "dining":
      return <DiningDashboard moduleConfig={moduleConfig} />;
    case "marketplace":
      return <MarketplaceDashboard moduleConfig={moduleConfig} />;
    case "wallet":
      return <WalletDashboard moduleConfig={moduleConfig} />;
    case "financial":
      return <FinancialDashboard moduleConfig={moduleConfig} />;
    case "quick-cash":
      return <QuickCashDashboard moduleConfig={moduleConfig} />;
    case "grades":
      return <ReportCardDashboard moduleConfig={moduleConfig} />;
    case "on-campus-jobs":
      return <OnCampusJobsDashboard moduleConfig={moduleConfig} />;
    case "necessary-documents":
      return <NecessaryDocumentsDashboard moduleConfig={moduleConfig} />;
    
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Module not implemented yet</p>
          </div>
        </div>
      );
  }
} 
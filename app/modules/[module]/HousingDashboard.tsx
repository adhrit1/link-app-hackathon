"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DormQuiz } from "./DormQuiz";
import { OnboardingQuiz } from "./OnboardingQuiz";
import { RoommateQuiz } from "./RoommateQuiz";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function HousingDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [tab, setTab] = useState<"housing" | "freshman" | "roommate">("housing");

  const renderContent = () => {
    switch (tab) {
      case "freshman":
        return (
          <OnboardingQuiz
            moduleConfig={{
              ...moduleConfig,
              title: "Freshmen Flow",
              description: "Onboard now and get matched with the best dorms",
            }}
          />
        );
      case "roommate":
        return (
          <RoommateQuiz
            moduleConfig={{
              ...moduleConfig,
              title: "Roommate Matching",
              description: "Find compatible roommates based on lifestyle",
            }}
          />
        );
      default:
        return <DormQuiz moduleConfig={moduleConfig} />;
    }
  };

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Housing & Dorms</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              variant={tab === "housing" ? "default" : "outline"}
              onClick={() => setTab("housing")}
            >
              Housing Quiz
            </Button>
            <Button
              variant={tab === "freshman" ? "default" : "outline"}
              onClick={() => setTab("freshman")}
            >
              Freshmen Flow
            </Button>
            <Button
              variant={tab === "roommate" ? "default" : "outline"}
              onClick={() => setTab("roommate")}
            >
              Roommate Search
            </Button>
          </CardContent>
        </Card>
        {renderContent()}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DormLiving } from "./DormLiving";
import { OnboardingQuiz } from "./OnboardingQuiz";
import { RoommateQuiz } from "./RoommateQuiz";
import { useAgentSystem } from "@/components/AgentSystem";
interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function HousingDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [tab, setTab] = useState<"living" | "freshman" | "roommate">("living");
  const [isFreshman, setIsFreshman] = useState(false);
  const { processRequest } = useAgentSystem();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await processRequest({ agentId: 'profiler', action: 'get_profile' });
        setIsFreshman(profile?.year === 'Freshman');
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    };
    loadProfile();
  }, [processRequest]);

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
        return <DormLiving moduleConfig={moduleConfig} />;
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
              variant={tab === "living" ? "default" : "outline"}
              onClick={() => setTab("living")}
            >
              Dorm Life
            </Button>
            <Button
              variant={tab === "freshman" ? "default" : "outline"}
              onClick={() => isFreshman && setTab("freshman")}
              disabled={!isFreshman}
              className={!isFreshman ? "opacity-50" : ""}
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
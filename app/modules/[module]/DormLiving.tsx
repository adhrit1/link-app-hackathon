"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, WashingMachine, Megaphone, Utensils } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface DormInfo {
  id: string;
  title: string;
  description: string;
}

export function DormLiving({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [dorm, setDorm] = useState<DormInfo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('freshmanFlowResults');
    if (saved) {
      try {
        const recs = JSON.parse(saved);
        if (Array.isArray(recs) && recs.length > 0) {
          setDorm(recs[0]);
          localStorage.setItem('selectedDorm', recs[0].id);
        }
      } catch {
        // ignore JSON errors
      }
    }
  }, []);

  if (!dorm) {
    return (
      <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>\
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>No Dorm Matched</CardTitle>
              <CardDescription>
                Complete the Freshmen Flow to get your dorm assignment.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const diningHours = [
    { meal: "Breakfast", time: "7:00 AM - 10:00 AM" },
    { meal: "Lunch", time: "11:30 AM - 2:00 PM" },
    { meal: "Dinner", time: "5:00 PM - 9:00 PM" },
  ];

  const laundryStatus = [
    { machine: "Washer 1", status: "Available" },
    { machine: "Washer 2", status: "In Use" },
    { machine: "Dryer 1", status: "Available" },
  ];

  const announcements = [
    "Game night in the lounge at 7pm",
    "Maintenance will inspect rooms on Friday",
    "Sign up for the weekend hike by Thursday",
  ];

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>\
      <div className="container mx-auto px-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl">{dorm.title}</CardTitle>
            </div>
            <CardDescription>{dorm.description}</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-red-600" />
              <CardTitle>Dining Hours</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {diningHours.map((d, i) => (
              <div key={i} className="flex justify-between">
                <span>{d.meal}</span>
                <Badge variant="outline">{d.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <WashingMachine className="h-5 w-5 text-blue-600" />
              <CardTitle>Laundry Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {laundryStatus.map((l, i) => (
              <div key={i} className="flex justify-between">
                <span>{l.machine}</span>
                <Badge variant="outline">{l.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-green-600" />
              <CardTitle>Announcements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {announcements.map((a, i) => (
              <p key={i} className="text-sm">• {a}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
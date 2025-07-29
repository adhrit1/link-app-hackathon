"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, WashingMachine, Megaphone, Utensils } from "lucide-react";
import Link from "next/link";

interface DormInfo {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  reddit_posts: Array<{ title: string; url: string }>;
  walking_time?: string;
  score?: number;
}

export default function DormLifePage() {
  const params = useSearchParams();
  const dormId = params.get("dorm");
  const [dorm, setDorm] = useState<DormInfo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("freshmanFlowResults");
    if (saved) {
      try {
        const recs: DormInfo[] = JSON.parse(saved);
        const match = recs.find((d) => d.id === dormId) || recs[0];
        if (match) {
          setDorm(match);
          localStorage.setItem("selectedDorm", match.id);
        }
      } catch {
        // ignore
      }
    }
  }, [dormId]);

  if (!dorm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No dorm data found. Complete Freshman Flow first.</p>
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
    <div className="min-h-screen bg-blue-50 py-8">
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

        <Button
          asChild
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          <Link href={`/modules/roommate-search?dorm=${encodeURIComponent(dorm.id)}`}>Find Roommates</Link>
        </Button>

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

        {dorm.reddit_posts?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reddit Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dorm.reddit_posts.map((p, i) => (
                <Badge key={i} variant="outline" asChild>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.title}
                  </a>
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
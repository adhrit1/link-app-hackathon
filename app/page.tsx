"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { ArrowUpRight, ArrowDownRight, ChevronDown, TrendingUp, Search, Plus, Database, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Bar, BarChart, CartesianGrid, XAxis, Line, Dot, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useAuth } from "@/lib/AuthContext"
import { EmptyState } from "@/components/ui/empty-state"
import { useRouter } from "next/navigation"
import { TextShimmer } from "@/components/ui/text-shimmer"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Define type for API brand rankings response
type APIBrandRanking = {
  id: number;
  created_at: string;
  brand_name: string;
  variations: string;
  rankings: string;
  brand_category: string;
  brand_geo: string;
  uid: string;
};

type APIBrandRankingsResponse = {
  success: boolean;
  count: number;
  results: APIBrandRanking[];
};

const brands = [
  { rank: 1, name: "Everlane", domain: "everlane.com", change: 4, score: 89.3 },
  { rank: 2, name: "Reformation", domain: "thereformation.com", change: 7, score: 85.7 },
  { rank: 3, name: "Aritzia", domain: "aritzia.com", change: -1, score: 82.4 },
  { rank: 4, name: "COS", domain: "cosstores.com", change: 3, score: 79.8 },
  { rank: 5, name: "Ganni", domain: "ganni.com", change: 9, score: 76.2 },
  { rank: 6, name: "& Other Stories", domain: "stories.com", change: 2, score: 73.6 },
]

const llms = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google", label: "Google" },
  { id: "mistral", label: "Mistral" },
  { id: "cohere", label: "Cohere" },
]

const regions = [
  { id: "na", label: "North America" },
  { id: "eu", label: "Europe" },
  { id: "asia", label: "Asia" },
  { id: "aus", label: "Australia" },
];

const chartData = [
  { date: "Jan 20", desktop: 88, swimming: 70, running: 65, cycling: 50 },
  { date: "Jan 21", desktop: 92, swimming: 65, running: 72, cycling: 48 },
  { date: "Jan 22", desktop: 85, swimming: 75, running: 68, cycling: 55 },
  { date: "Jan 23", desktop: 90, swimming: 62, running: 70, cycling: 60 },
  { date: "Jan 24", desktop: 82, swimming: 78, running: 75, cycling: 52 },
  { date: "Jan 25", desktop: 95, swimming: 68, running: 80, cycling: 57 },
  { date: "Jan 26", desktop: 87, swimming: 72, running: 76, cycling: 62 },
  { date: "Jan 27", desktop: 93, swimming: 67, running: 82, cycling: 54 },
  { date: "Jan 28", desktop: 89, swimming: 73, running: 78, cycling: 59 },
  { date: "Jan 29", desktop: 100, swimming: 65, running: 75, cycling: 45 },
  { date: "Jan 30", desktop: 92, swimming: 78, running: 62, cycling: 55 },
  { date: "Jan 31", desktop: 98, swimming: 56, running: 82, cycling: 48 },
  { date: "Feb 01", desktop: 80, swimming: 72, running: 65, cycling: 60 },
  { date: "Feb 02", desktop: 88, swimming: 68, running: 70, cycling: 52 },
  { date: "Feb 03", desktop: 95, swimming: 59, running: 68, cycling: 57 },
  { date: "Feb 04", desktop: 80, swimming: 83, running: 72, cycling: 50 },
  { date: "Feb 05", desktop: 85, swimming: 75, running: 80, cycling: 62 },
  { date: "Feb 06", desktop: 90, swimming: 62, running: 75, cycling: 58 },
  { date: "Feb 07", desktop: 85, swimming: 70, running: 78, cycling: 53 },
  { date: "Feb 08", desktop: 92, swimming: 66, running: 72, cycling: 55 },
  { date: "Feb 09", desktop: 88, swimming: 73, running: 75, cycling: 60 },
  { date: "Feb 10", desktop: 93, swimming: 68, running: 80, cycling: 52 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb", // blue-600
  },
  swimming: {
    label: "Swimming",
    color: "#3b82f6", // blue-500
  },
  running: {
    label: "Running",
    color: "#10b981", // emerald-500
  },
  cycling: {
    label: "Cycling",
    color: "#6366f1", // indigo-500
  },
} satisfies ChartConfig

export default function Home() {
  // Define the boxes and their blurbs
  const boxes = [
    { title: "Community", blurb: "Connect with student groups and events.", module: "community", onboard: true },
    { title: "Housing", blurb: "Find student housing and roommates.", module: "dorm", onboard: true },
    { title: "Enrolment", blurb: "Sign up for courses and manage your registration.", module: "enrollment" },
    { title: "Grades", blurb: "View your academic performance and grades.", module: "grades" },
    { title: "Ed Discussion", blurb: "Join class discussions and ask questions.", module: "ed-discussion" },
    { title: "Canvas", blurb: "Access course materials and assignments.", module: "canvas" },
    { title: "Job", blurb: "Find on-campus and part-time job opportunities.", module: "job", onboard: true },
    { title: "Health", blurb: "Access health resources and support.", module: "health", onboard: true },
    { title: "Safety", blurb: "Stay informed about campus safety.", module: "safety", onboard: true },
    { title: "Academic Support", blurb: "Get help with your studies and tutoring.", module: "academic-support", onboard: true },
    { title: "Transportation", blurb: "Plan your commute and campus transport.", module: "transportation", onboard: true },
    { title: "Personal Health", blurb: "Track your wellness and appointments.", module: "health", onboard: true },
    { title: "Student Wallet", blurb: "Manage your student finances and payments.", module: "wallet", onboard: true },
    { title: "Marketplace", blurb: "Buy, sell, or trade with other students.", module: "marketplace", onboard: true },
    { title: "Quick Cash", blurb: "Find quick ways to earn money on campus.", module: "quick-cash", onboard: true },
    { title: "On Campus", blurb: "Explore campus facilities and services.", module: "on-campus" },
  ];
  return (
    <div className="ml-24 mt-8 relative">
      <div className="flex items-center justify-between mb-8 pr-8">
        <h1 className="text-3xl font-bold text-gray-900">Home</h1>
        <img src="/berkley-logo.jpeg" alt="Berkley Logo" className="w-20 h-20 rounded-full object-cover" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pr-8">
        {boxes.map(({ title, blurb, module, onboard }) => (
          module ? (
            <Link href={`/modules/${module}`} key={title} className="w-full h-full cursor-pointer text-left focus:outline-none">
              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="relative">
                  {onboard && (
                    <Badge variant="default" className="absolute -top-8 -right-3 shadow-md z-10">Onboard now</Badge>
                  )}
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{blurb}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <button key={title} className="w-full h-full cursor-pointer text-left focus:outline-none" type="button">
              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="relative">
                  {onboard && (
                    <Badge variant="default" className="absolute -top-8 -right-3 shadow-md z-10">Onboard now</Badge>
                  )}
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{blurb}</CardDescription>
                </CardHeader>
              </Card>
            </button>
          )
        ))}
      </div>
    </div>
  );
} 
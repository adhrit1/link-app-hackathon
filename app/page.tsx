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
import { 
  CardSkeleton, 
  LoadingSpinner, 
  FullPageLoader,
  StatusIndicator 
} from "@/components/ui/loading-states"
import { useNotifications, showSuccess, showError } from "@/components/ui/notifications"
import { apiCall, withRetry } from "@/lib/error-handling"
import { cache, performanceMonitor } from "@/lib/performance"
import { KeyboardIndicator, SrOnly } from "@/components/ui/accessibility"

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const { user, isLoading: authLoading } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();

  // Performance monitoring - moved to useEffect
  const [pageLoadTimer, setPageLoadTimer] = useState<(() => void) | null>(null);

  useEffect(() => {
    // Initialize performance timer
    const timer = performanceMonitor.startTimer('home-page-load');
    setPageLoadTimer(() => timer);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check cache first
        const cachedData = cache.get('user-home-data');
        if (cachedData) {
          setUserData(cachedData);
          setIsLoading(false);
          return;
        }

        // Load fresh data with retry
        const data = await withRetry(async () => {
          const response = await apiCall('/api/user/home-data', {
            method: 'GET',
          });
          return response;
        });

        setUserData(data);
        
        // Cache the data
        cache.set('user-home-data', data);

        // Show success notification
        showSuccess('Welcome back!', 'Your dashboard is ready.');
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        showError('Loading failed', errorMessage);
      } finally {
        setIsLoading(false);
        // Call timer if available
        if (pageLoadTimer) {
          pageLoadTimer();
        }
      }
    };

    // Load data regardless of auth state for demo
    loadUserData();
  }, [pageLoadTimer]);

  // Show loading state only if we're still loading and don't have data
  if (isLoading && !userData) {
    return (
      <div className="ml-24 mt-8 relative">
        <div className="flex items-center justify-between mb-8 pr-8">
          <div className="flex items-center space-x-4">
            <LoadingSpinner size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loading...</h1>
              <p className="text-gray-600">Preparing your dashboard</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pr-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !userData) {
    return (
      <div className="ml-24 mt-8 relative">
        <EmptyState
          title="Failed to load dashboard"
          description={error}
          action={
            <Button onClick={() => window.location.reload()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  // Show main dashboard
  return (
    <div className="ml-24 mt-8 relative">
      <div className="flex items-center justify-between mb-8 pr-8">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userData?.user?.name || 'Student'}!
            </h1>
            <p className="text-gray-600">Here's what's happening today</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pr-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.quick_stats?.courses_enrolled || 0}</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.quick_stats?.events_this_week || 0}</div>
            <p className="text-xs text-muted-foreground">
              Campus activities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.quick_stats?.unread_notifications || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unread messages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPA</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.quick_stats?.gpa || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              Current semester
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-8">
        {userData?.modules && Object.entries(userData.modules).map(([key, module]: [string, any]) => (
          <Link key={key} href={`/modules/${key}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>{module.title}</span>
                  <Badge variant={module.status === 'ready' ? 'default' : 'secondary'}>
                    {module.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Progress: {module.progress}%
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      {userData?.recent_activity && userData.recent_activity.length > 0 && (
        <div className="mt-8 pr-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.recent_activity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 
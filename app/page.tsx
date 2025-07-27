"use client"

import React from "react"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Users, 
  Heart, 
  Shield, 
  GraduationCap, 
  Briefcase, 
  Home as HomeIcon, 
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  DollarSign,
  ShoppingBag,
  Activity,
  Target
} from "lucide-react"
import Link from "next/link"

// Full module list, always shown
const modules = [
  {
    key: "freshman-flow",
    title: "Freshman Flow",
    description: "Onboard now and get matched with the best dorms",
    icon: Heart,
    color: "bg-teal-500",
    href: "/modules/freshman-flow",
    status: "available"
  },
  {
    key: "marketplace",
    title: "Marketplace",
    description: "Student-to-Student, Student-to-Real World, Second Hand, Lost & Found",
    icon: ShoppingBag,
    color: "bg-yellow-500",
    href: "/modules/marketplace",
    status: "available"
  },
  {
    key: "community",
    title: "Clubs & Community",
    description: "Student clubs, Greek life, volunteer board, and leadership opportunities.",
    icon: Users,
    color: "bg-blue-500",
    href: "/modules/community",
    status: "available"
  },
  {
    key: "grades",
    title: "Grades & Analytics",
    description: "BerkeleyTime data, professor ratings, and grade distributions.",
    icon: TrendingUp,
    color: "bg-purple-500",
    href: "/modules/grades",
    status: "available"
  },
  {
    key: "enrollment",
    title: "Course Enrollment",
    description: "Personalized quiz, AI-powered class recommendations, and enrollment tools.",
    icon: BookOpen,
    color: "bg-orange-500",
    href: "/modules/enrollment",
    status: "completed"
  },
  {
    key: "dorm",
    title: "Housing & Dorms",
    description: "Find and manage your housing arrangements, dorm info, and roommate matching.",
    icon: HomeIcon,
    color: "bg-cyan-500",
    href: "/modules/dorm",
    status: "completed"
  },
  {
    key: "job",
    title: "Jobs & Internships",
    description: "Campus jobs, internships, and career resources.",
    icon: Briefcase,
    color: "bg-pink-500",
    href: "/modules/job",
    status: "in-progress"
  },
  {
    key: "academic-support",
    title: "Academic Support",
    description: "Tutoring, study groups, and academic resources.",
    icon: GraduationCap,
    color: "bg-indigo-500",
    href: "/modules/academic-support",
    status: "available"
  },
  {
    key: "health",
    title: "Health & Fitness",
    description: "RSF crowd meter, health services, and fitness classes.",
    icon: Activity,
    color: "bg-red-500",
    href: "/modules/health",
    status: "available"
  },
  {
    key: "safety",
    title: "Safety & Security",
    description: "Campus safety resources, BearWalk, and emergency contacts.",
    icon: Shield,
    color: "bg-gray-500",
    href: "/modules/safety",
    status: "available"
  }
]

export default function DashboardPage() {
  const totalModules = modules.length
  const completedModules = modules.filter(m => m.status === 'completed').length
  const inProgressModules = modules.filter(m => m.status === 'in-progress').length
  const availableModules = modules.filter(m => m.status === 'available').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/berkley-logo.jpeg" alt="UC Berkeley Logo" width={120} height={120} className="rounded-full shadow-md mb-4" priority />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Demo User! <span role="img" aria-label="wave">👋</span></h1>
          <p className="text-gray-600">Computer Science • Freshman • UC Berkeley</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Modules</p>
                  <p className="text-2xl font-bold text-blue-600">{totalModules}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedModules}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600">{inProgressModules}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-purple-600">{availableModules}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/modules/freshman-flow">
            <Button variant="default" className="w-full h-16 flex flex-col items-center justify-center gap-2">
              <Heart className="h-6 w-6" />
              <span className="text-sm">Onboard Now</span>
            </Button>
          </Link>
          <Link href="/calendar">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Calendar</span>
            </Button>
            </Link>
            <Link href="/modules/wallet">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Wallet</span>
              </Button>
            </Link>
            <Link href="/modules/grades">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Analytics</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2">
                <Activity className="h-6 w-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module) => {
              const Icon = module.icon
              const statusColors = {
                completed: "bg-green-100 text-green-800",
                "in-progress": "bg-orange-100 text-orange-800",
                available: "bg-blue-100 text-blue-800"
              }
              return (
                <Link key={module.key} href={module.href}>
                  <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${module.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                          <Icon className={`h-6 w-6 ${module.color.replace('bg-', 'text-')}`} />
                        </div>
                        <Badge className={statusColors[module.status] || "bg-gray-100 text-gray-800"}>
                          {module.status === "completed" ? "✓ Complete" : 
                           module.status === "in-progress" ? "⏳ In Progress" : "Available"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 mt-3">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-xs text-blue-600">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        View module
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
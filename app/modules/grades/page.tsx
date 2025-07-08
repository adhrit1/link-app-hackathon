"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  Award, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Calendar,
  GraduationCap
} from "lucide-react"

interface Grade {
  id: string
  courseCode: string
  courseName: string
  grade: string
  gpa: number
  credits: number
  assignments: Array<{
    name: string
    grade: number
    weight: number
    dueDate: string
  }>
  classAverage?: number
  gradeTrend: 'up' | 'down' | 'stable'
}

interface Semester {
  id: string
  name: string
  gpa: number
  credits: number
  grades: Grade[]
}

export default function GradesPage() {
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real data from backend API
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch real grades data from backend
        const response = await fetch('/api/grades')
        if (!response.ok) {
          throw new Error('Failed to fetch grades data')
        }
        
        const data = await response.json()
        if (data.semester) {
          setCurrentSemester(data.semester)
        } else {
          setError('No grades data available')
        }
      } catch (err) {
        console.error('Error fetching grades:', err)
        setError('Unable to load grades data')
      } finally {
      setIsLoading(false)
      }
    }

    fetchGrades()
  }, [])

  const calculateCumulativeGPA = () => {
    if (!currentSemester) return 0
    const totalPoints = currentSemester.grades.reduce((sum, grade) => sum + (grade.gpa * grade.credits), 0)
    const totalCredits = currentSemester.grades.reduce((sum, grade) => sum + grade.credits, 0)
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600'
    if (grade.startsWith('B')) return 'text-blue-600'
    if (grade.startsWith('C')) return 'text-yellow-600'
    if (grade.startsWith('D')) return 'text-orange-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="ml-24 mt-8 relative">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading your academic record...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentSemester) {
    return (
      <div className="ml-24 mt-8 relative">
        <div className="text-center py-8">
          {error ? (
            <div>
              <p className="text-red-600 mb-2">{error}</p>
              <p className="text-gray-600">Please try again later or contact support.</p>
            </div>
          ) : (
          <p>No academic data available</p>
          )}
        </div>
      </div>
    )
  }

  const cumulativeGPA = calculateCumulativeGPA()

  return (
    <div className="ml-24 mt-8 relative">
      <div className="flex items-center justify-between mb-8 pr-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Digital Report Card</h1>
          <p className="text-gray-600 mt-2">Track your academic progress and performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Academic Calendar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pr-8">
        {/* GPA Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Current GPA
            </CardTitle>
            <CardDescription>Fall 2024 Semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {currentSemester.gpa.toFixed(2)}
              </div>
              <p className="text-gray-600 mb-4">Semester GPA</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Credits:</span>
                  <span className="font-semibold">{currentSemester.credits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cumulative:</span>
                  <span className="font-semibold">{cumulativeGPA.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Standing */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Academic Standing
            </CardTitle>
            <CardDescription>Your current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">
                Good Standing
              </Badge>
              <p className="text-sm text-gray-600">All requirements met</p>
            </div>
          </CardContent>
        </Card>

        {/* Grade Timeline */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Grade Timeline
            </CardTitle>
            <CardDescription>Upcoming grade releases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">CS 61A Final</span>
                <Badge variant="outline">Dec 15</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">PHYSICS 7A Final</span>
                <Badge variant="outline">Dec 12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ENGLISH R1A Paper</span>
                <Badge variant="outline">Dec 5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Degree Progress */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Degree Progress
            </CardTitle>
            <CardDescription>Requirements completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>General Education</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Major Requirements</span>
                  <span>25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Credits</span>
                  <span>15/120</span>
                </div>
                <Progress value={12.5} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Grades */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Current Semester Grades
            </CardTitle>
            <CardDescription>Detailed breakdown of your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentSemester.grades.map((grade) => (
                <div 
                  key={grade.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedGrade(grade)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{grade.courseCode}</h3>
                      <p className="text-sm text-gray-600">{grade.courseName}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(grade.gradeTrend)}
                        <span className={`text-2xl font-bold ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">GPA: {grade.gpa}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Credits:</span>
                      <span className="ml-2 font-semibold">{grade.credits}</span>
                    </div>
                    {grade.classAverage && (
                      <div>
                        <span className="text-gray-600">Class Average:</span>
                        <span className="ml-2 font-semibold">{grade.classAverage}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Detail Modal */}
      {selectedGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedGrade.courseCode} - {selectedGrade.courseName}</h2>
              <Button variant="outline" onClick={() => setSelectedGrade(null)}>Close</Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{selectedGrade.grade}</div>
                  <div className="text-sm text-gray-600">Current Grade</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{selectedGrade.gpa}</div>
                  <div className="text-sm text-gray-600">GPA Points</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{selectedGrade.credits}</div>
                  <div className="text-sm text-gray-600">Credits</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Assignment Breakdown</h3>
                <div className="space-y-2">
                  {selectedGrade.assignments.map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{assignment.name}</div>
                        <div className="text-sm text-gray-500">Due: {assignment.dueDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{assignment.grade}%</div>
                        <div className="text-sm text-gray-500">{assignment.weight}% weight</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedGrade.classAverage && (
                <div className="p-3 bg-blue-50 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Class Average</span>
                    <span className="text-lg font-bold">{selectedGrade.classAverage}%</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    You are {selectedGrade.classAverage > 85 ? 'above' : 'below'} the class average
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
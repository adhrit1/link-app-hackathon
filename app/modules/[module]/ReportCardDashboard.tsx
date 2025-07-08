"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, TrendingUp, BookOpen, Award } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function ReportCardDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Digital Report Card</CardTitle>
              </div>
              <CardDescription>
                Track your grades, GPA, and academic progress
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Current GPA</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">3.85</p>
                  <p className="text-sm text-gray-600">+0.15 from last semester</p>
                  <Badge variant="outline" className="mt-2 text-green-600">Improving</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Credits Completed</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">72</p>
                  <p className="text-sm text-gray-600">of 120 required</p>
                  <Badge variant="outline" className="mt-2 text-blue-600">60% Complete</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold">Dean's List</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-sm text-gray-600">semesters</p>
                  <Badge variant="outline" className="mt-2 text-purple-600">Eligible</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold">Expected Graduation</h4>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">2025</p>
                  <p className="text-sm text-gray-600">Spring Semester</p>
                  <Badge variant="outline" className="mt-2 text-orange-600">On Track</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Semester Grades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Calculus I</h4>
                    <p className="text-sm text-gray-600">MATH 1A • 4 units</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">A-</p>
                    <p className="text-sm text-gray-600">92.5%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">English 1A</h4>
                    <p className="text-sm text-gray-600">ENGL 1A • 4 units</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">A</p>
                    <p className="text-sm text-gray-600">95.2%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Chemistry 1A</h4>
                    <p className="text-sm text-gray-600">CHEM 1A • 4 units</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">B+</p>
                    <p className="text-sm text-gray-600">87.8%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">View Full Transcript</h4>
                  <p className="text-sm text-gray-600">Complete academic history</p>
                  <Badge variant="outline" className="mt-2">View Transcript</Badge>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">Grade Calculator</h4>
                  <p className="text-sm text-gray-600">Calculate final grades</p>
                  <Badge variant="outline" className="mt-2">Calculate</Badge>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">Academic Planning</h4>
                  <p className="text-sm text-gray-600">Plan your course schedule</p>
                  <Badge variant="outline" className="mt-2">Plan Courses</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
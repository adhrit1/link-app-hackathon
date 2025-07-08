"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, DollarSign, MapPin } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function OnCampusJobsDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-2xl">On-Campus Jobs</CardTitle>
              </div>
              <CardDescription>
                Find on-campus and part-time job opportunities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Library Assistant</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">$15/hr</p>
                  <p className="text-sm text-gray-600">10-15 hours/week</p>
                  <Badge variant="outline" className="mt-2 text-green-600">Hiring Now</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Campus Tour Guide</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">$18/hr</p>
                  <p className="text-sm text-gray-600">Flexible hours</p>
                  <Badge variant="outline" className="mt-2 text-green-600">Hiring Now</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold">IT Help Desk</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">$20/hr</p>
                  <p className="text-sm text-gray-600">15-20 hours/week</p>
                  <Badge variant="outline" className="mt-2 text-green-600">Hiring Now</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Library Assistant</h4>
                    <p className="text-sm text-gray-600">Applied: 2 days ago</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">Under Review</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Campus Tour Guide</h4>
                    <p className="text-sm text-gray-600">Applied: 1 week ago</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">Interview Scheduled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">Browse All Jobs</h4>
                  <p className="text-sm text-gray-600">Find more opportunities</p>
                  <Badge variant="outline" className="mt-2">Explore Jobs</Badge>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">Update Resume</h4>
                  <p className="text-sm text-gray-600">Keep your profile current</p>
                  <Badge variant="outline" className="mt-2">Edit Profile</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
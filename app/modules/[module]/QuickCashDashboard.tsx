"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, TrendingUp, Users } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function QuickCashDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                <CardTitle className="text-2xl">Quick Cash Dashboard</CardTitle>
              </div>
              <CardDescription>
                Find gigs and quick money opportunities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Gigs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Event Setup</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">$25/hr</p>
                  <p className="text-sm text-gray-600">3 hours today</p>
                  <Badge variant="outline" className="mt-2 text-green-600">Available Now</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Research Study</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">$50</p>
                  <p className="text-sm text-gray-600">1 hour session</p>
                  <Badge variant="outline" className="mt-2 text-green-600">Available Now</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold">Tutoring</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">$30/hr</p>
                  <p className="text-sm text-gray-600">Math & Science</p>
                  <Badge variant="outline" className="mt-2 text-green-600">Available Now</Badge>
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
                  <h4 className="font-semibold">Post a Gig</h4>
                  <p className="text-sm text-gray-600">Offer your services</p>
                  <Badge variant="outline" className="mt-2">Create Post</Badge>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold">Browse All Gigs</h4>
                  <p className="text-sm text-gray-600">Find more opportunities</p>
                  <Badge variant="outline" className="mt-2">Explore</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
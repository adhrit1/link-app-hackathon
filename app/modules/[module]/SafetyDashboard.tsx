"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Phone, MapPin, Users, Clock, Bell } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface SafetyAlert {
  id: string;
  type: "police" | "weather" | "power" | "general";
  title: string;
  description: string;
  location: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  active: boolean;
}

export function SafetyDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [activeAlerts, setActiveAlerts] = useState<SafetyAlert[]>([
    {
      id: "1",
      type: "police",
      title: "Police Activity Near Campus",
      description: "Police activity reported near Telegraph Ave and Durant Ave. Avoid the area if possible.",
      location: "Telegraph Ave & Durant Ave",
      timestamp: "2 minutes ago",
      severity: "medium",
      active: true
    },
    {
      id: "2",
      type: "weather",
      title: "Heavy Rain Expected",
      description: "Heavy rainfall expected this evening. Use caution when walking on campus.",
      location: "Campus-wide",
      timestamp: "15 minutes ago",
      severity: "low",
      active: true
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'police': return <Shield className="h-4 w-4" />;
      case 'weather': return <AlertTriangle className="h-4 w-4" />;
      case 'power': return <Bell className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
            </div>
            <p className="text-gray-600">{moduleConfig.description}</p>
          </div>

          {/* Emergency Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-red-800 mb-2">Emergency SOS</h3>
                <p className="text-sm text-red-700 mb-3">Silent emergency with location and medical info</p>
                <Button className="bg-red-600 hover:bg-red-700 w-full">Activate SOS</Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800 mb-2">SafeWalk Tracker</h3>
                <p className="text-sm text-blue-700 mb-3">Let friends or security watch your route</p>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">Start SafeWalk</Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 mb-2">Request Bear Walk</h3>
                <p className="text-sm text-green-700 mb-3">Campus security escort service</p>
                <Button className="bg-green-600 hover:bg-green-700 w-full">Request Walk</Button>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Active Safety Alerts
              </CardTitle>
              <CardDescription>
                Real-time safety alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getTypeIcon(alert.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{alert.title}</h4>
                              <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {alert.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {alert.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Dismiss
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Safety Resources
              </CardTitle>
              <CardDescription>
                Important safety contacts and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Campus Police</h4>
                  <p className="text-sm text-gray-600 mb-2">UC Berkeley Police Department</p>
                  <p className="text-sm text-gray-600 mb-3">Emergency: (510) 642-3333</p>
                  <Button size="sm">Call Now</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Title IX Resources</h4>
                  <p className="text-sm text-gray-600 mb-2">Sexual harassment and assault support</p>
                  <p className="text-sm text-gray-600 mb-3">24/7 confidential support</p>
                  <Button size="sm">Get Help</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Crisis Response</h4>
                  <p className="text-sm text-gray-600 mb-2">Mental health crisis support</p>
                  <p className="text-sm text-gray-600 mb-3">Crisis Text Line: Text HOME to 741741</p>
                  <Button size="sm">Get Support</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">WarnMe System</h4>
                  <p className="text-sm text-gray-600 mb-2">Emergency notification system</p>
                  <p className="text-sm text-gray-600 mb-3">Stay informed about campus emergencies</p>
                  <Button size="sm">Sign Up</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Tips for Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Walking at Night</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use well-lit paths and walk with friends</li>
                    <li>• Stay alert and avoid distractions</li>
                    <li>• Use Bear Walk escort service when available</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Emergency Preparedness</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Keep emergency contacts updated</li>
                    <li>• Know your location and nearest exits</li>
                    <li>• Have a plan for different emergency scenarios</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
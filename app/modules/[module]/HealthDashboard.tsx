"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Activity, Dumbbell, Heart, Search, Filter, Brain, Target, Clock, MapPin, Users } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface GymLocation {
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  hours: string;
  features: string[];
  classes: GymClass[];
}

interface GymClass {
  name: string;
  time: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  type: string;
}

interface LocalGym {
  name: string;
  location: string;
  type: string;
  studentDiscount: string;
  description: string;
  features: string[];
}

export function HealthDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [showAssessment, setShowAssessment] = useState(false);

  const gymLocations: GymLocation[] = [
    {
      name: "RSF (Recreational Sports Facility)",
      location: "2301 Bancroft Way",
      capacity: 200,
      currentOccupancy: 120,
      hours: "6:00 AM - 12:00 AM",
      features: ["Cardio equipment", "Weight room", "Basketball courts", "Swimming pool", "Rock climbing"],
      classes: [
        {
          name: "Yoga for Beginners",
          time: "10:00 AM - 11:00 AM",
          instructor: "Sarah Johnson",
          capacity: 20,
          enrolled: 15,
          type: "Yoga"
        },
        {
          name: "HIIT Training",
          time: "4:00 PM - 5:00 PM",
          instructor: "Mike Chen",
          capacity: 25,
          enrolled: 22,
          type: "Cardio"
        },
        {
          name: "Strength Training",
          time: "6:00 PM - 7:00 PM",
          instructor: "Alex Rodriguez",
          capacity: 15,
          enrolled: 12,
          type: "Strength"
        }
      ]
    },
    {
      name: "Golden Bear Recreation Center",
      location: "2301 Bancroft Way",
      capacity: 150,
      currentOccupancy: 85,
      hours: "6:00 AM - 11:00 PM",
      features: ["Fitness equipment", "Group exercise rooms", "Locker rooms", "Sauna"],
      classes: [
        {
          name: "Pilates",
          time: "9:00 AM - 10:00 AM",
          instructor: "Emma Davis",
          capacity: 18,
          enrolled: 14,
          type: "Mind-Body"
        },
        {
          name: "Zumba",
          time: "5:30 PM - 6:30 PM",
          instructor: "Maria Garcia",
          capacity: 30,
          enrolled: 28,
          type: "Dance"
        }
      ]
    },
    {
      name: "Strawberry Canyon Recreation Area",
      location: "Strawberry Canyon",
      capacity: 100,
      currentOccupancy: 25,
      hours: "7:00 AM - 8:00 PM",
      features: ["Tennis courts", "Soccer fields", "Running trails", "Outdoor fitness"],
      classes: [
        {
          name: "Outdoor Bootcamp",
          time: "8:00 AM - 9:00 AM",
          instructor: "David Kim",
          capacity: 20,
          enrolled: 12,
          type: "Outdoor"
        }
      ]
    }
  ];

  const localGyms: LocalGym[] = [
    {
      name: "Planet Fitness",
      location: "2020 Shattuck Ave",
      type: "Fitness Center",
      studentDiscount: "20% off membership",
      description: "Judgment-free zone with modern equipment and friendly atmosphere",
      features: ["24/7 access", "Free fitness training", "Tanning", "Massage chairs"]
    },
    {
      name: "Berkeley Yoga Center",
      location: "2121 Bonar St",
      type: "Yoga Studio",
      studentDiscount: "15% off classes",
      description: "Traditional and modern yoga classes for all levels",
      features: ["Vinyasa", "Hatha", "Meditation", "Workshops"]
    },
    {
      name: "CrossFit Berkeley",
      location: "1800 4th St",
      type: "CrossFit Gym",
      studentDiscount: "10% off monthly membership",
      description: "High-intensity functional fitness training",
      features: ["CrossFit classes", "Personal training", "Nutrition coaching"]
    }
  ];

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage < 50) return "text-green-600";
    if (percentage < 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getCapacityBadge = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage < 50) return <Badge className="bg-green-100 text-green-800">Low</Badge>;
    if (percentage < 80) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-red-100 text-red-800">High</Badge>;
  };

  const filteredGyms = gymLocations.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "All" || gym.features.some(f => f.toLowerCase().includes(selectedType.toLowerCase()));
    return matchesSearch && matchesType;
  });

  const filteredLocalGyms = localGyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || gym.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Activity className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
            </div>
            <p className="text-gray-600">{moduleConfig.description}</p>
          </div>

          {/* Fitness Assessment Button */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Button 
                  onClick={() => setShowAssessment(!showAssessment)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Start Your Fitness Assessment Today
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  3-question quiz to understand which fitness spaces and activities are right for you
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Modal */}
          {showAssessment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Fitness Assessment
                </CardTitle>
                <CardDescription>
                  Let's find the perfect fitness activities for your freshman year
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">What fitness activities interest you?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Cardio", "Strength training", "Yoga", "Team sports", "Swimming", "Dance"].map(activity => (
                        <Button key={activity} variant="outline" className="justify-start">
                          {activity}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">What's your fitness experience level?</label>
                    <div className="space-y-2">
                      {["Beginner", "Intermediate", "Advanced", "Very experienced"].map(level => (
                        <Button key={level} variant="outline" className="w-full justify-start">
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">What wellness services are you interested in?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Mental health counseling", "Nutrition advice", "Stress management", "Sleep support"].map(service => (
                        <Button key={service} variant="outline" className="justify-start">
                          {service}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Get Recommendations</Button>
                  <Button variant="outline" onClick={() => setShowAssessment(false)}>Close</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search for activities, locations, or classes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Filter className="h-4 w-4 text-gray-400 mt-3" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="All">All Types</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Sports">Sports</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campus Gym Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-blue-600" />
                Campus Gym Locations
              </CardTitle>
              <CardDescription>
                Real-time capacity for all campus fitness facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredGyms.map((gym, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{gym.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{gym.location}</span>
                          </div>
                        </div>
                        {getCapacityBadge(gym.currentOccupancy, gym.capacity)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Capacity:</span>
                          <span className={getCapacityColor(gym.currentOccupancy, gym.capacity)}>
                            {gym.currentOccupancy}/{gym.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              getCapacityColor(gym.currentOccupancy, gym.capacity).replace('text-', 'bg-')
                            }`}
                            style={{ width: `${(gym.currentOccupancy / gym.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Hours:</span>
                          <span>{gym.hours}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {gym.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Group Fitness Classes */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2">Today's Classes</h4>
                        <div className="space-y-2">
                          {gym.classes.map((classItem, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium text-sm">{classItem.name}</p>
                                <p className="text-xs text-gray-600">{classItem.time} • {classItem.instructor}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{classItem.type}</Badge>
                                <span className="text-xs text-gray-600">{classItem.enrolled}/{classItem.capacity}</span>
                                <Button size="sm" variant="outline" className="text-xs">
                                  Join
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm">
                          <Clock className="h-4 w-4 mr-2" />
                          Set Capacity Alert
                        </Button>
                        <Button className="flex-1" size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-2" />
                          View on Map
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Local Gyms & Studios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-600" />
                Local Gyms & Wellness Studios
              </CardTitle>
              <CardDescription>
                Community fitness options with student discounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLocalGyms.map((gym, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{gym.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{gym.location}</span>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Student Discount</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-700 mb-3">{gym.description}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Type:</span>
                          <span>{gym.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Student Discount:</span>
                          <span className="font-medium text-green-600">{gym.studentDiscount}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {gym.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Get Student Discount
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Berkeley Health Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Berkeley Health Services
              </CardTitle>
              <CardDescription>
                Integrated health services and appointment booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Tele-health Appointments</h4>
                  <p className="text-sm text-gray-600 mb-2">Virtual consultations with healthcare providers</p>
                  <p className="text-sm text-gray-600 mb-3">Current wait time: 2-3 days</p>
                  <Button size="sm">Book Appointment</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Mental Health Counseling</h4>
                  <p className="text-sm text-gray-600 mb-2">24/7 crisis support and counseling services</p>
                  <p className="text-sm text-gray-600 mb-3">Crisis Text Line: Text HOME to 741741</p>
                  <Button size="sm">Schedule Session</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Vaccination & Medication</h4>
                  <p className="text-sm text-gray-600 mb-2">Vaccination appointments and medication reminders</p>
                  <p className="text-sm text-gray-600 mb-3">Insurance: Your Berkeley Health plan</p>
                  <Button size="sm">Book Vaccination</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Sleep & Stress Tracking</h4>
                  <p className="text-sm text-gray-600 mb-2">Connect your wearables for wellness insights</p>
                  <p className="text-sm text-gray-600 mb-3">Apple Health, Fitbit, Oura integration</p>
                  <Button size="sm">Connect Device</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
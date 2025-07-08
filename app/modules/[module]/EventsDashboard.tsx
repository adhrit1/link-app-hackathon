"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Search, Filter, Star } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface Event {
  id: string;
  title: string;
  type: "academic" | "social" | "sports" | "cultural" | "career";
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  maxAttendees: number;
  price: string;
  tags: string[];
  featured: boolean;
}

export function EventsDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const events: Event[] = [
    {
      id: "1",
      title: "Freshman Welcome Mixer",
      type: "social",
      date: "2024-01-15",
      time: "6:00 PM - 9:00 PM",
      location: "MLK Student Union",
      description: "Meet your fellow freshmen and make new friends! Free food and activities.",
      attendees: 45,
      maxAttendees: 100,
      price: "Free",
      tags: ["Freshman", "Social", "Networking"],
      featured: true
    },
    {
      id: "2",
      title: "CS 61A Study Group",
      type: "academic",
      date: "2024-01-16",
      time: "7:00 PM - 9:00 PM",
      location: "Soda Hall 306",
      description: "Weekly study group for CS 61A students. Bring your questions!",
      attendees: 12,
      maxAttendees: 20,
      price: "Free",
      tags: ["Computer Science", "Study Group", "CS 61A"],
      featured: false
    },
    {
      id: "3",
      title: "Cal Football vs Stanford",
      type: "sports",
      date: "2024-01-20",
      time: "3:30 PM - 7:00 PM",
      location: "California Memorial Stadium",
      description: "The Big Game! Support the Golden Bears against Stanford.",
      attendees: 45000,
      maxAttendees: 63000,
      price: "$25",
      tags: ["Football", "Big Game", "Sports"],
      featured: true
    },
    {
      id: "4",
      title: "Career Fair: Tech Companies",
      type: "career",
      date: "2024-01-18",
      time: "10:00 AM - 4:00 PM",
      location: "Hearst Memorial Mining Building",
      description: "Meet with top tech companies for internships and full-time positions.",
      attendees: 200,
      maxAttendees: 500,
      price: "Free",
      tags: ["Career", "Tech", "Internships"],
      featured: true
    },
    {
      id: "5",
      title: "Diwali Celebration",
      type: "cultural",
      date: "2024-01-22",
      time: "5:00 PM - 8:00 PM",
      location: "Zellerbach Hall",
      description: "Celebrate Diwali with traditional food, music, and dance performances.",
      attendees: 80,
      maxAttendees: 150,
      price: "$5",
      tags: ["Cultural", "Diwali", "Performance"],
      featured: false
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "All" || event.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'sports': return 'bg-orange-100 text-orange-800';
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'career': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (attendees: number, maxAttendees: number) => {
    const percentage = (attendees / maxAttendees) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
            </div>
            <p className="text-gray-600">{moduleConfig.description}</p>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search for events, activities, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Filter className="h-4 w-4 text-gray-400 mt-3" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="All">All Types</option>
                    <option value="academic">Academic</option>
                    <option value="social">Social</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="career">Career</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Featured Events
              </CardTitle>
              <CardDescription>
                Don't miss these highlighted events for freshmen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.filter(event => event.featured).map((event) => (
                  <Card key={event.id} className="border-2 border-yellow-200 bg-yellow-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{event.location}</span>
                          </div>
                        </div>
                        <Badge className={getTypeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Date:</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Time:</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Price:</span>
                          <span className="font-medium">{event.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Attendees:</span>
                          <span className={getAttendanceColor(event.attendees, event.maxAttendees)}>
                            {event.attendees}/{event.maxAttendees}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {event.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        RSVP Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                All Events
              </CardTitle>
              <CardDescription>
                Browse all upcoming events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            {event.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            <Badge className={getTypeColor(event.type)}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees}/{event.maxAttendees}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-medium">{event.price}</span>
                          <Button size="sm" variant="outline">
                            RSVP
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Event Categories</CardTitle>
              <CardDescription>
                Explore events by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Academic Events</h4>
                  <p className="text-sm text-gray-600 mb-3">Study groups, lectures, workshops</p>
                  <Button size="sm" variant="outline">Browse Academic</Button>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Social Events</h4>
                  <p className="text-sm text-gray-600 mb-3">Mixers, parties, networking</p>
                  <Button size="sm" variant="outline">Browse Social</Button>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Sports & Recreation</h4>
                  <p className="text-sm text-gray-600 mb-3">Games, fitness, outdoor activities</p>
                  <Button size="sm" variant="outline">Browse Sports</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Search, Filter, Star } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface Event {
  id: string;
  title: string;
  type: "academic" | "social" | "sports" | "cultural" | "career";
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  maxAttendees: number;
  price: string;
  tags: string[];
  featured: boolean;
}

export function EventsDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const events: Event[] = [
    {
      id: "1",
      title: "Freshman Welcome Mixer",
      type: "social",
      date: "2024-01-15",
      time: "6:00 PM - 9:00 PM",
      location: "MLK Student Union",
      description: "Meet your fellow freshmen and make new friends! Free food and activities.",
      attendees: 45,
      maxAttendees: 100,
      price: "Free",
      tags: ["Freshman", "Social", "Networking"],
      featured: true
    },
    {
      id: "2",
      title: "CS 61A Study Group",
      type: "academic",
      date: "2024-01-16",
      time: "7:00 PM - 9:00 PM",
      location: "Soda Hall 306",
      description: "Weekly study group for CS 61A students. Bring your questions!",
      attendees: 12,
      maxAttendees: 20,
      price: "Free",
      tags: ["Computer Science", "Study Group", "CS 61A"],
      featured: false
    },
    {
      id: "3",
      title: "Cal Football vs Stanford",
      type: "sports",
      date: "2024-01-20",
      time: "3:30 PM - 7:00 PM",
      location: "California Memorial Stadium",
      description: "The Big Game! Support the Golden Bears against Stanford.",
      attendees: 45000,
      maxAttendees: 63000,
      price: "$25",
      tags: ["Football", "Big Game", "Sports"],
      featured: true
    },
    {
      id: "4",
      title: "Career Fair: Tech Companies",
      type: "career",
      date: "2024-01-18",
      time: "10:00 AM - 4:00 PM",
      location: "Hearst Memorial Mining Building",
      description: "Meet with top tech companies for internships and full-time positions.",
      attendees: 200,
      maxAttendees: 500,
      price: "Free",
      tags: ["Career", "Tech", "Internships"],
      featured: true
    },
    {
      id: "5",
      title: "Diwali Celebration",
      type: "cultural",
      date: "2024-01-22",
      time: "5:00 PM - 8:00 PM",
      location: "Zellerbach Hall",
      description: "Celebrate Diwali with traditional food, music, and dance performances.",
      attendees: 80,
      maxAttendees: 150,
      price: "$5",
      tags: ["Cultural", "Diwali", "Performance"],
      featured: false
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "All" || event.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'sports': return 'bg-orange-100 text-orange-800';
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'career': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (attendees: number, maxAttendees: number) => {
    const percentage = (attendees / maxAttendees) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
            </div>
            <p className="text-gray-600">{moduleConfig.description}</p>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search for events, activities, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Filter className="h-4 w-4 text-gray-400 mt-3" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="All">All Types</option>
                    <option value="academic">Academic</option>
                    <option value="social">Social</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="career">Career</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Featured Events
              </CardTitle>
              <CardDescription>
                Don't miss these highlighted events for freshmen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.filter(event => event.featured).map((event) => (
                  <Card key={event.id} className="border-2 border-yellow-200 bg-yellow-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{event.location}</span>
                          </div>
                        </div>
                        <Badge className={getTypeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Date:</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Time:</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Price:</span>
                          <span className="font-medium">{event.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Attendees:</span>
                          <span className={getAttendanceColor(event.attendees, event.maxAttendees)}>
                            {event.attendees}/{event.maxAttendees}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {event.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        RSVP Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                All Events
              </CardTitle>
              <CardDescription>
                Browse all upcoming events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            {event.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            <Badge className={getTypeColor(event.type)}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees}/{event.maxAttendees}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-medium">{event.price}</span>
                          <Button size="sm" variant="outline">
                            RSVP
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Event Categories</CardTitle>
              <CardDescription>
                Explore events by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Academic Events</h4>
                  <p className="text-sm text-gray-600 mb-3">Study groups, lectures, workshops</p>
                  <Button size="sm" variant="outline">Browse Academic</Button>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Social Events</h4>
                  <p className="text-sm text-gray-600 mb-3">Mixers, parties, networking</p>
                  <Button size="sm" variant="outline">Browse Social</Button>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Sports & Recreation</h4>
                  <p className="text-sm text-gray-600 mb-3">Games, fitness, outdoor activities</p>
                  <Button size="sm" variant="outline">Browse Sports</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
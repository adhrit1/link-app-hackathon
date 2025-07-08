"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Users, 
  BookOpen, 
  Clock, 
  MapPin, 
  CheckCircle,
  TrendingUp,
  Star,
  Calendar,
  MessageSquare,
  FileText,
  ExternalLink,
  AlertCircle,
  Loader2,
  Download,
  Upload,
  Eye,
  RefreshCw
} from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface AcademicResource {
  name: string;
  type: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  hours: string;
  subjects: string[];
  description: string;
  waitTime?: string;
  nextAvailable?: string;
}

interface StudySpace {
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  type: string;
  features: string[];
  hours: string;
}

interface CanvasCourse {
  id: string;
  name: string;
  code: string;
  instructor: string;
  enrollment: number;
  assignments_due: number;
  announcements: number;
  grade_percentage?: number;
  last_activity?: string;
  modules_completed?: number;
  total_modules?: number;
}

interface EdDiscussion {
  id: string;
  title: string;
  course: string;
  author: string;
  replies: number;
  views: number;
  last_activity: string;
  is_resolved: boolean;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

export function AcademicSupportDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [canvasCourses, setCanvasCourses] = useState<CanvasCourse[]>([]);
  const [edDiscussions, setEdDiscussions] = useState<EdDiscussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadCourseData();
  }, []);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load Canvas courses
      const canvasResponse = await fetch('/api/canvas/courses');
      if (canvasResponse.ok) {
        const canvasData = await canvasResponse.json();
        setCanvasCourses(canvasData);
      } else {
        setCanvasCourses([]);
      }

      // Load Ed Discussion posts
      const edResponse = await fetch('/api/ed-discussion/posts');
      if (edResponse.ok) {
        const edData = await edResponse.json();
        setEdDiscussions(edData);
      } else {
        setEdDiscussions([]);
      }
    } catch (err) {
      setError('Failed to load course data');
      setCanvasCourses([]);
      setEdDiscussions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for tutoring centers
  const tutoringCenters: AcademicResource[] = [
    {
      name: "Student Learning Center (SLC)",
      type: "Tutoring",
      location: "Cesar Chavez Student Center",
      capacity: 50,
      currentOccupancy: 35,
      hours: "Mon-Fri 9AM-5PM, Sat 10AM-2PM",
      subjects: ["Math", "Physics", "Chemistry", "Writing"],
      description: "Comprehensive academic support for all subjects with drop-in and appointment-based tutoring.",
      waitTime: "10-15 minutes",
      nextAvailable: "2:30 PM"
    },
    {
      name: "Engineering Student Services",
      type: "Tutoring",
      location: "Bechtel Engineering Center",
      capacity: 30,
      currentOccupancy: 28,
      hours: "Mon-Fri 8AM-6PM",
      subjects: ["CS", "Engineering", "Math", "Physics"],
      description: "Specialized support for engineering students with industry-experienced tutors.",
      waitTime: "20-25 minutes",
      nextAvailable: "3:45 PM"
    },
    {
      name: "Writing Center",
      type: "Tutoring",
      location: "Dwinelle Hall",
      capacity: 20,
      currentOccupancy: 12,
      hours: "Mon-Thu 9AM-8PM, Fri 9AM-5PM",
      subjects: ["Writing", "Literature", "Research Papers"],
      description: "One-on-one writing consultation for essays, research papers, and creative writing.",
      waitTime: "5-10 minutes",
      nextAvailable: "1:15 PM"
    },
    {
      name: "Math & Statistics Support",
      type: "Tutoring",
      location: "Evans Hall",
      capacity: 40,
      currentOccupancy: 22,
      hours: "Mon-Fri 10AM-6PM, Sun 2PM-6PM",
      subjects: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math"],
      description: "Specialized math tutoring with graduate student instructors.",
      waitTime: "15-20 minutes",
      nextAvailable: "2:00 PM"
    }
  ];

  // Mock data for study spaces
  const studySpaces: StudySpace[] = [
    {
      name: "Moffitt Library",
      location: "Bancroft Way",
      capacity: 500,
      currentOccupancy: 320,
      type: "Silent Study",
      features: ["24/7 Access", "Printing", "Computers", "Group Rooms"],
      hours: "24/7"
    },
    {
      name: "Doe Library",
      location: "Bancroft Way",
      capacity: 300,
      currentOccupancy: 180,
      type: "Mixed",
      features: ["Historical Reading Room", "Computers", "Printing", "Special Collections"],
      hours: "Mon-Fri 8AM-10PM, Sat-Sun 10AM-6PM"
    },
    {
      name: "Engineering Library",
      location: "Bechtel Engineering Center",
      capacity: 200,
      currentOccupancy: 150,
      type: "Group Study",
      features: ["Whiteboards", "Projectors", "Computers", "Technical Resources"],
      hours: "Mon-Fri 8AM-8PM, Sat 10AM-4PM"
    },
    {
      name: "Undergraduate Library",
      location: "Bancroft Way",
      capacity: 400,
      currentOccupancy: 280,
      type: "Mixed",
      features: ["Computers", "Printing", "Group Study Rooms", "Media Center"],
      hours: "Mon-Thu 8AM-12AM, Fri 8AM-8PM, Sat-Sun 10AM-8PM"
    }
  ];

  const filteredTutoring = tutoringCenters.filter(center =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    center.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudySpaces = studySpaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredEdDiscussions = edDiscussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unresolved' && !discussion.is_resolved) ||
                         (selectedFilter === 'resolved' && discussion.is_resolved);
    return matchesSearch && matchesFilter;
  });

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const getCapacityBadge = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 80) return <Badge variant="destructive">Full</Badge>;
    if (percentage >= 60) return <Badge variant="secondary">Busy</Badge>;
    return <Badge variant="default">Available</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getGradeColor = (percentage?: number) => {
    if (!percentage) return 'text-gray-600';
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your academic resources...</h3>
          <p className="text-gray-600">Connecting to Canvas and Ed Discussion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
          <p className="text-gray-600 mt-2">{moduleConfig.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">Live Updates</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Tutors</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Spaces</p>
                <p className="text-2xl font-bold text-blue-600">4</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Canvas Courses</p>
                <p className="text-2xl font-bold text-purple-600">{canvasCourses.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ed Discussions</p>
                <p className="text-2xl font-bold text-orange-600">{edDiscussions.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="support" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="support">Academic Support</TabsTrigger>
          <TabsTrigger value="courses">Course Integration</TabsTrigger>
          <TabsTrigger value="discussions">Ed Discussions</TabsTrigger>
        </TabsList>

        {/* Academic Support Tab */}
        <TabsContent value="support" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tutoring centers, study spaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Tutoring">Tutoring Centers</option>
              <option value="Study">Study Spaces</option>
            </select>
          </div>

          {/* Tutoring Centers */}
          {(selectedType === "All" || selectedType === "Tutoring") && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Tutoring Centers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTutoring.map((center) => (
                  <Card key={center.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{center.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            {center.location}
                          </CardDescription>
                        </div>
                        {getCapacityBadge(center.currentOccupancy, center.capacity)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Capacity:</span>
                          <span className={getCapacityColor(center.currentOccupancy, center.capacity)}>
                            {center.currentOccupancy}/{center.capacity}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hours:</span>
                          <span>{center.hours}</span>
                        </div>
                        {center.waitTime && (
                          <div className="flex justify-between text-sm">
                            <span>Wait Time:</span>
                            <span className="text-orange-600">{center.waitTime}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {center.subjects.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{center.description}</p>
                        <Button className="w-full">Book Appointment</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Study Spaces */}
          {(selectedType === "All" || selectedType === "Study") && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Study Spaces
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudySpaces.map((space) => (
                  <Card key={space.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{space.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            {space.location}
                          </CardDescription>
                        </div>
                        {getCapacityBadge(space.currentOccupancy, space.capacity)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Type:</span>
                          <span>{space.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Capacity:</span>
                          <span className={getCapacityColor(space.currentOccupancy, space.capacity)}>
                            {space.currentOccupancy}/{space.capacity}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hours:</span>
                          <span>{space.hours}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {space.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full">Check Availability</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Course Integration Tab */}
        <TabsContent value="courses" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Canvas Course Integration
              </CardTitle>
              <CardDescription>
                Real-time data from your enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {canvasCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No Canvas courses found</p>
                  <Button variant="outline" onClick={loadCourseData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {canvasCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{course.name}</CardTitle>
                            <p className="text-sm text-gray-600">{course.code}</p>
                          </div>
                          {course.grade_percentage && (
                            <Badge className={`${getGradeColor(course.grade_percentage)}`}>
                              {course.grade_percentage}%
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Instructor:</span>
                            <span className="font-medium">{course.instructor}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Enrollment:</span>
                            <span>{course.enrollment} students</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Assignments Due:</span>
                            <span className="text-orange-600 font-medium">{course.assignments_due}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Announcements:</span>
                            <span>{course.announcements}</span>
                          </div>
                          {course.modules_completed && course.total_modules && (
                            <div className="flex justify-between text-sm">
                              <span>Progress:</span>
                              <span>{course.modules_completed}/{course.total_modules} modules</span>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Course
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Download className="h-4 w-4 mr-1" />
                              Materials
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ed Discussions Tab */}
        <TabsContent value="discussions" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                Ed Discussion Posts
              </CardTitle>
              <CardDescription>
                Recent discussions from your courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Posts</option>
                  <option value="unresolved">Unresolved</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {filteredEdDiscussions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No Ed Discussion posts found</p>
                  <Button variant="outline" onClick={loadCourseData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEdDiscussions.map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{discussion.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Course: {discussion.course}</span>
                              <span>By: {discussion.author}</span>
                              <span>Views: {discussion.views}</span>
                              <span>Replies: {discussion.replies}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(discussion.priority)}>
                              {discussion.priority}
                            </Badge>
                            {discussion.is_resolved ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-orange-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            Last activity: {discussion.last_activity}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
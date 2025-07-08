"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Filter, GraduationCap, MapPin, Calendar, FileCheck } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface Document {
  name: string;
  category: string;
  description: string;
  status: 'required' | 'optional' | 'recommended';
  downloadUrl?: string;
  formUrl?: string;
}

export function NecessaryDocumentsDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const documents: Document[] = [
    // Academic Forms
    {
      name: "Late Schedule Change Petition",
      category: "Academic",
      description: "Request late schedule changes after the deadline",
      status: "required",
      formUrl: "#"
    },
    {
      name: "Grade Appeal Form",
      category: "Academic",
      description: "Appeal course grades within 30 days",
      status: "required",
      formUrl: "#"
    },
    {
      name: "Academic Probation Appeal",
      category: "Academic",
      description: "Appeal academic probation status",
      status: "required",
      formUrl: "#"
    },
    {
      name: "Course Enrollment Petition",
      category: "Academic",
      description: "Petition to enroll in restricted courses",
      status: "required",
      formUrl: "#"
    },
    {
      name: "Academic Calendar 2024-2025",
      category: "Academic",
      description: "Important dates and deadlines",
      status: "recommended",
      downloadUrl: "#"
    },
    
    // Housing Forms
    {
      name: "Dorm Application",
      category: "Housing",
      description: "Apply for on-campus housing",
      status: "required",
      formUrl: "/modules/dorm"
    },
    {
      name: "Room Change Request",
      category: "Housing",
      description: "Request a room change during the semester",
      status: "optional",
      formUrl: "#"
    },
    {
      name: "Housing Contract Cancellation",
      category: "Housing",
      description: "Cancel housing contract with valid reason",
      status: "required",
      formUrl: "#"
    },
    
    // Financial Forms
    {
      name: "Financial Aid Appeal",
      category: "Financial",
      description: "Appeal financial aid decisions",
      status: "required",
      formUrl: "#"
    },
    {
      name: "Payment Plan Request",
      category: "Financial",
      description: "Set up payment plan for tuition",
      status: "recommended",
      formUrl: "#"
    },
    {
      name: "Scholarship Application",
      category: "Financial",
      description: "Apply for various scholarships",
      status: "recommended",
      formUrl: "#"
    },
    
    // Health Forms
    {
      name: "Health Insurance Waiver",
      category: "Health",
      description: "Waive student health insurance if you have other coverage",
      status: "required",
      formUrl: "#"
    },
    {
      name: "Medical Excuse Form",
      category: "Health",
      description: "Request medical excuse for missed classes",
      status: "optional",
      formUrl: "#"
    },
    
    // General Documents
    {
      name: "Student Handbook",
      category: "General",
      description: "Complete student handbook with policies and procedures",
      status: "recommended",
      downloadUrl: "#"
    },
    {
      name: "Campus Map",
      category: "General",
      description: "Interactive campus map with building locations",
      status: "recommended",
      downloadUrl: "#"
    },
    {
      name: "Emergency Contact Form",
      category: "General",
      description: "Update emergency contact information",
      status: "required",
      formUrl: "#"
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...Array.from(new Set(documents.map(doc => doc.category)))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'required':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'recommended':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'optional':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academic':
        return <GraduationCap className="h-4 w-4" />;
      case 'Housing':
        return <MapPin className="h-4 w-4" />;
      case 'Financial':
        return <FileText className="h-4 w-4" />;
      case 'Health':
        return <FileCheck className="h-4 w-4" />;
      case 'General':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search for forms and documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Filter className="h-4 w-4 text-gray-400 mt-3" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(doc.category)}
                      <div>
                        <CardTitle className="text-lg">{doc.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.category}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4">
                    {doc.description}
                  </CardDescription>
                  <div className="flex gap-2">
                    {doc.formUrl && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.location.href = doc.formUrl!}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Fill Form
                      </Button>
                    )}
                    {doc.downloadUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(doc.downloadUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 
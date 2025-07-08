"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Search, FileText, MapPin, Calendar, GraduationCap } from 'lucide-react';

interface NavigationItem {
  name: string;
  path: string;
  category: string;
  description: string;
}

export function BearAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NavigationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Navigation items that the bear can help users find
  const navigationItems: NavigationItem[] = [
    // Academic Forms
    {
      name: "Late Schedule Change Petition Form",
      path: "/modules/necessary-documents",
      category: "Academic",
      description: "Form to request late schedule changes"
    },
    {
      name: "Grade Appeal Form",
      path: "/modules/necessary-documents",
      category: "Academic",
      description: "Form to appeal course grades"
    },
    {
      name: "Academic Probation Appeal",
      path: "/modules/necessary-documents",
      category: "Academic",
      description: "Appeal academic probation status"
    },
    {
      name: "Course Enrollment Petition",
      path: "/modules/necessary-documents",
      category: "Academic",
      description: "Petition to enroll in restricted courses"
    },
    
    // Housing Forms
    {
      name: "Dorm Application",
      path: "/modules/dorm",
      category: "Housing",
      description: "Apply for on-campus housing"
    },
    {
      name: "Room Change Request",
      path: "/modules/dorm",
      category: "Housing",
      description: "Request a room change"
    },
    {
      name: "Housing Contract Cancellation",
      path: "/modules/dorm",
      category: "Housing",
      description: "Cancel housing contract"
    },
    
    // Financial Forms
    {
      name: "Financial Aid Appeal",
      path: "/modules/financial",
      category: "Financial",
      description: "Appeal financial aid decisions"
    },
    {
      name: "Payment Plan Request",
      path: "/modules/financial",
      category: "Financial",
      description: "Set up payment plan for tuition"
    },
    {
      name: "Scholarship Application",
      path: "/modules/financial",
      category: "Financial",
      description: "Apply for scholarships"
    },
    
    // Health Forms
    {
      name: "Health Insurance Waiver",
      path: "/modules/health",
      category: "Health",
      description: "Waive student health insurance"
    },
    {
      name: "Medical Excuse Form",
      path: "/modules/health",
      category: "Health",
      description: "Request medical excuse for missed classes"
    },
    
    // General Navigation
    {
      name: "Academic Calendar",
      path: "/modules/necessary-documents",
      category: "General",
      description: "View important academic dates"
    },
    {
      name: "Campus Map",
      path: "/modules/necessary-documents",
      category: "General",
      description: "Interactive campus map"
    },
    {
      name: "Student Handbook",
      path: "/modules/necessary-documents",
      category: "General",
      description: "Complete student handbook"
    }
  ];

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const searchResults = navigationItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(searchResults);
      setIsSearching(false);
    }, 500);
  };

  const handleNavigate = (path: string) => {
    window.location.href = path;
    setIsOpen(false);
    setQuery('');
    setResults([]);
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
        return <FileText className="h-4 w-4" />;
      case 'General':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Bear Agent Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <span className="text-2xl">🐻</span>
        </Button>
      </div>

      {/* Bear Agent Chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96">
          <Card className="shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐻</span>
                  <CardTitle className="text-lg">Berkeley Bear Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Ask me where to find forms, documents, or anything on campus!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Late schedule change petition form"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  size="icon"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Results */}
              {results.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleNavigate(item.path)}
                    >
                      <div className="flex items-start gap-2">
                        {getCategoryIcon(item.category)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Suggestions */}
              {!query && results.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Try asking about:</p>
                  <div className="flex flex-wrap gap-1">
                    {['Late schedule change petition', 'Dorm application', 'Financial aid appeal', 'Health insurance waiver'].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setQuery(suggestion);
                          handleSearch();
                        }}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isSearching && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Searching...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 
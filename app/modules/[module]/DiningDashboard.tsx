"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Utensils, MapPin, Clock, Star, Search, Filter, DollarSign } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface DiningLocation {
  name: string;
  type: "dining_hall" | "cafe" | "restaurant" | "food_truck";
  location: string;
  hours: string;
  rating: number;
  priceRange: string;
  cuisine: string[];
  currentWait: string;
  specialOffers: string[];
  mealPlanAccepted: boolean;
}

export function DiningDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const diningLocations: DiningLocation[] = [
    {
      name: "Crossroads Dining Hall",
      type: "dining_hall",
      location: "2415 Bowditch St",
      hours: "7:00 AM - 10:00 PM",
      rating: 4.2,
      priceRange: "$$",
      cuisine: ["American", "International", "Vegetarian"],
      currentWait: "5 min",
      specialOffers: ["All-you-can-eat", "Meal plan accepted"],
      mealPlanAccepted: true
    },
    {
      name: "Cafe 3",
      type: "dining_hall",
      location: "2400 Durant Ave",
      hours: "7:00 AM - 9:00 PM",
      rating: 4.0,
      priceRange: "$$",
      cuisine: ["Asian", "American", "Halal"],
      currentWait: "10 min",
      specialOffers: ["Halal options", "Meal plan accepted"],
      mealPlanAccepted: true
    },
    {
      name: "Clark Kerr Campus Dining",
      type: "dining_hall",
      location: "2601 Warring St",
      hours: "7:00 AM - 8:00 PM",
      rating: 4.1,
      priceRange: "$$",
      cuisine: ["American", "Mexican", "Vegetarian"],
      currentWait: "3 min",
      specialOffers: ["Scenic views", "Meal plan accepted"],
      mealPlanAccepted: true
    },
    {
      name: "Foothill Dining Hall",
      type: "dining_hall",
      location: "2700 Hearst Ave",
      hours: "7:00 AM - 9:00 PM",
      rating: 4.3,
      priceRange: "$$",
      cuisine: ["American", "Italian", "Vegetarian"],
      currentWait: "7 min",
      specialOffers: ["Pizza station", "Meal plan accepted"],
      mealPlanAccepted: true
    },
    {
      name: "Top Dog",
      type: "restaurant",
      location: "2534 Durant Ave",
      hours: "10:00 AM - 2:00 AM",
      rating: 4.1,
      priceRange: "$",
      cuisine: ["Hot Dogs", "American"],
      currentWait: "8 min",
      specialOffers: ["Late night", "Student favorite"],
      mealPlanAccepted: false
    }
  ];

  const filteredLocations = diningLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.cuisine.some(cuisine => cuisine.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "All" || location.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dining_hall': return <Utensils className="h-4 w-4" />;
      case 'cafe': return <Utensils className="h-4 w-4" />;
      case 'restaurant': return <Utensils className="h-4 w-4" />;
      case 'food_truck': return <Utensils className="h-4 w-4" />;
      default: return <Utensils className="h-4 w-4" />;
    }
  };

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'text-green-600';
      case '$$': return 'text-yellow-600';
      case '$$$': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Utensils className="h-8 w-8 text-red-600" />
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
                    placeholder="Search for restaurants, cuisines, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Filter className="h-4 w-4 text-gray-400 mt-3" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="All">All Types</option>
                    <option value="dining_hall">Dining Halls</option>
                    <option value="cafe">Cafes</option>
                    <option value="restaurant">Restaurants</option>
                    <option value="food_truck">Food Trucks</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dining Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-red-600" />
                Dining Options
              </CardTitle>
              <CardDescription>
                Discover the best dining options on and around campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLocations.map((location, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{location.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{location.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{location.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Hours:</span>
                          <span>{location.hours}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Price:</span>
                          <span className={`font-medium ${getPriceColor(location.priceRange)}`}>
                            {location.priceRange}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Current wait:</span>
                          <span className="font-medium">{location.currentWait}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {location.cuisine.map((cuisine, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cuisine}
                          </Badge>
                        ))}
                      </div>

                      {location.specialOffers.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-1">Special offers:</p>
                          <div className="flex flex-wrap gap-1">
                            {location.specialOffers.map((offer, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {offer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          View Menu
                        </Button>
                        {location.mealPlanAccepted && (
                          <Button className="flex-1" size="sm" variant="outline">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Use Meal Plan
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Meal Plan Management */}
          <Card>
            <CardHeader>
              <CardTitle>Meal Plan Management</CardTitle>
              <CardDescription>
                Track your meal plan usage and budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Meal Swipes Remaining</h4>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">of 20 this week</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Bear Bucks Balance</h4>
                  <p className="text-2xl font-bold text-green-600">$45.20</p>
                  <p className="text-sm text-gray-600">Available for dining</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Weekly Spending</h4>
                  <p className="text-2xl font-bold text-orange-600">$78.50</p>
                  <p className="text-sm text-gray-600">of $100 budget</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Dishes */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Dishes This Week</CardTitle>
              <CardDescription>
                What students are loving right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Crossroads - Poke Bowl</h4>
                  <p className="text-sm text-gray-600 mb-2">Fresh salmon, rice, vegetables</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">4.5/5 (120 reviews)</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Cafe 3 - Ramen</h4>
                  <p className="text-sm text-gray-600 mb-2">House-made broth, noodles, toppings</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">4.3/5 (89 reviews)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
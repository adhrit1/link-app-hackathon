"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus, Bike, Car, MapPin, Clock, Users, Search } from "lucide-react";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface TransitRoute {
  name: string;
  type: "bus" | "shuttle" | "bart";
  route: string;
  destination: string;
  nextArrival: string;
  crowding: "low" | "medium" | "high";
  status: "on_time" | "delayed" | "cancelled";
}

interface BikeStation {
  name: string;
  location: string;
  availableBikes: number;
  totalDocks: number;
  status: "open" | "closed" | "maintenance";
}

interface ParkingLot {
  name: string;
  location: string;
  availableSpots: number;
  totalSpots: number;
  hourlyRate: string;
  evCharging: boolean;
}

export function TransportationDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [selectedType, setSelectedType] = useState("All");

  const transitRoutes: TransitRoute[] = [
    {
      name: "Campus Shuttle",
      type: "shuttle",
      route: "Perimeter",
      destination: "Around Campus",
      nextArrival: "3 min",
      crowding: "medium",
      status: "on_time"
    },
    {
      name: "AC Transit",
      type: "bus",
      route: "51B",
      destination: "Downtown Berkeley",
      nextArrival: "7 min",
      crowding: "low",
      status: "on_time"
    },
    {
      name: "BART",
      type: "bart",
      route: "Richmond-Fremont",
      destination: "Downtown Berkeley Station",
      nextArrival: "12 min",
      crowding: "high",
      status: "delayed"
    }
  ];

  const bikeStations: BikeStation[] = [
    {
      name: "Sather Gate",
      location: "Sather Gate",
      availableBikes: 8,
      totalDocks: 12,
      status: "open"
    },
    {
      name: "RSF",
      location: "Recreational Sports Facility",
      availableBikes: 3,
      totalDocks: 15,
      status: "open"
    },
    {
      name: "Unit 1",
      location: "Unit 1 Residence Hall",
      availableBikes: 0,
      totalDocks: 10,
      status: "open"
    }
  ];

  const parkingLots: ParkingLot[] = [
    {
      name: "Underhill",
      location: "Underhill Parking Structure",
      availableSpots: 45,
      totalSpots: 200,
      hourlyRate: "$3.50",
      evCharging: true
    },
    {
      name: "Telegraph-Channing",
      location: "Telegraph & Channing",
      availableSpots: 12,
      totalSpots: 50,
      hourlyRate: "$2.50",
      evCharging: false
    }
  ];

  const getCrowdingColor = (crowding: string) => {
    switch (crowding) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCrowdingBadge = (crowding: string) => {
    switch (crowding) {
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'high': return <Badge className="bg-red-100 text-red-800">High</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_time': return 'text-green-600';
      case 'delayed': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
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
              <Bus className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">{moduleConfig.title}</h1>
            </div>
            <p className="text-gray-600">{moduleConfig.description}</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <Bus className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800 mb-2">Plan Route</h3>
                <p className="text-sm text-blue-700 mb-3">Find the best way to get around</p>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">Plan Trip</Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <Bike className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 mb-2">Bike Share</h3>
                <p className="text-sm text-green-700 mb-3">Find available bikes and docks</p>
                <Button className="bg-green-600 hover:bg-green-700 w-full">Find Bike</Button>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <Car className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800 mb-2">Parking</h3>
                <p className="text-sm text-purple-700 mb-3">Find parking spots and EV charging</p>
                <Button className="bg-purple-600 hover:bg-purple-700 w-full">Find Parking</Button>
              </CardContent>
            </Card>
          </div>

          {/* Transit Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-blue-600" />
                Live Transit Updates
              </CardTitle>
              <CardDescription>
                Real-time campus shuttle and public transit information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transitRoutes.map((route, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Bus className="h-5 w-5 text-blue-600" />
                            <div>
                              <h4 className="font-semibold">{route.name}</h4>
                              <p className="text-sm text-gray-600">{route.route} • {route.destination}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Next arrival</p>
                            <p className={`font-semibold ${getStatusColor(route.status)}`}>
                              {route.nextArrival}
                            </p>
                          </div>
                          {getCrowdingBadge(route.crowding)}
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bike Share */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bike className="h-5 w-5 text-green-600" />
                Bike Share Stations
              </CardTitle>
              <CardDescription>
                Available bikes and dock availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bikeStations.map((station, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Bike className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold">{station.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{station.location}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Available bikes:</span>
                          <span className="font-medium">{station.availableBikes}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total docks:</span>
                          <span>{station.totalDocks}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(station.availableBikes / station.totalDocks) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3" variant="outline">
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-purple-600" />
                Parking & EV Charging
              </CardTitle>
              <CardDescription>
                Available parking spots and EV charging stations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parkingLots.map((lot, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="h-4 w-4 text-purple-600" />
                        <h4 className="font-semibold">{lot.name}</h4>
                        {lot.evCharging && (
                          <Badge className="bg-green-100 text-green-800 text-xs">EV Charging</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{lot.location}</p>
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Available spots:</span>
                          <span className="font-medium">{lot.availableSpots}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total spots:</span>
                          <span>{lot.totalSpots}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hourly rate:</span>
                          <span className="font-medium">{lot.hourlyRate}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(lot.availableSpots / lot.totalSpots) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full" variant="outline">
                        <MapPin className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campus Bike Repair */}
          <Card>
            <CardHeader>
              <CardTitle>Campus Bike Repair Stations</CardTitle>
              <CardDescription>
                Self-service bike repair stations around campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">RSF Bike Station</h4>
                  <p className="text-sm text-gray-600 mb-2">Tools and air pump available</p>
                  <p className="text-sm text-gray-600 mb-3">Status: Available</p>
                  <Button size="sm">View Details</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Sather Gate Station</h4>
                  <p className="text-sm text-gray-600 mb-2">Basic tools and repair stand</p>
                  <p className="text-sm text-gray-600 mb-3">Status: Available</p>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
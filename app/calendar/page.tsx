"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Trophy, GraduationCap, AlertTriangle, Music, Utensils, ChevronLeft, ChevronRight, Sparkles, Plus } from "lucide-react";

interface CalendarEvent {
  title: string;
  description: string;
  start: string;
  end: string;
  location: string;
  type: 'academic' | 'campus_event' | 'game_day' | 'holiday' | 'deadline' | 'conductor_recommendation';
  organizer?: string;
  insider_tip?: string;
  category?: string;
  source?: string;
  url?: string;
}

interface ConductorEvent {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  category: string;
  insider_tip: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [conductorEvents, setConductorEvents] = useState<ConductorEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConductor, setIsLoadingConductor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showConductorRecommendations, setShowConductorRecommendations] = useState(false);

  useEffect(() => {
    fetchCalendarEvents();
    fetchConductorEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching calendar events...');
      const response = await fetch('/api/calendar');
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      const data = await response.json();
      console.log('Calendar data received:', data);
      
      // Handle new data structure with events array and metadata
      const eventsArray = data.events || data;
      console.log('Events array:', eventsArray.length, 'events');
      
      // Filter out events with invalid dates and map the data
      const mappedEvents = eventsArray
        .filter((event: any) => {
          // Skip events with TBD or invalid dates
          return event.start && 
                 event.start !== 'TBDT00:00:00' && 
                 !event.start.includes('TBD') &&
                 !isNaN(new Date(event.start).getTime());
        })
        .map((event: any) => ({
          title: event.title,
          description: event.description,
          start: event.start,
          end: event.end,
          location: event.location,
          type: mapEventType(event.type),
          source: event.source,
          url: event.url
        }));
      
      console.log('Mapped events:', mappedEvents.length);
      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setError('Failed to load calendar events');
      // For demo purposes, show sample events
      setEvents(getSampleEvents());
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  const fetchConductorEvents = async () => {
    try {
      setIsLoadingConductor(true);
      const response = await fetch('/api/conductor/events');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConductorEvents(data.events);
        }
      }
    } catch (error) {
      console.error('Error fetching Conductor events:', error);
    } finally {
      setIsLoadingConductor(false);
    }
  };

  const addConductorEventToCalendar = async (event: ConductorEvent) => {
    try {
      const response = await fetch('/api/conductor/events/add-to-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_data: {
            title: event.title,
            description: event.description,
            location: event.location,
            start_time: event.start_time,
            end_time: event.end_time,
            organizer: event.organizer
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Add the event to the local calendar
          const newEvent: CalendarEvent = {
            title: event.title,
            description: event.description,
            start: event.start_time,
            end: event.end_time,
            location: event.location,
            type: 'conductor_recommendation',
            organizer: event.organizer,
            insider_tip: event.insider_tip,
            category: event.category
          };
          setEvents(prev => [...prev, newEvent]);
          
          // Remove from conductor events
          setConductorEvents(prev => prev.filter(e => e.title !== event.title));
          
          alert('Event added to calendar successfully!');
        }
      }
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      alert('Failed to add event to calendar');
    }
  };

  const mapEventType = (academicType: string): 'academic' | 'campus_event' | 'game_day' | 'holiday' | 'deadline' | 'conductor_recommendation' => {
    switch (academicType) {
      case 'semester_start':
      case 'instruction_start':
      case 'instruction_end':
      case 'finals':
      case 'study_week':
      case 'semester_end':
      case 'commencement':
        return 'academic';
      case 'holiday':
        return 'holiday';
      case 'special_event':
        return 'campus_event';
      case 'non_instructional':
        return 'deadline';
      case 'game_day':
        return 'game_day';
      case 'conductor_recommendation':
        return 'conductor_recommendation';
      default:
        return 'academic';
    }
  };

  const getSampleEvents = (): CalendarEvent[] => {
    return [
      {
        title: "Fall Semester Begins",
        description: "First day of classes for Fall 2024 semester",
        start: "2024-08-26T08:00:00",
        end: "2024-08-26T17:00:00",
        location: "UC Berkeley Campus",
        type: "academic"
      },
      {
        title: "Cal Football vs. Stanford",
        description: "Big Game - Annual rivalry match against Stanford",
        start: "2024-11-23T15:30:00",
        end: "2024-11-23T19:00:00",
        location: "California Memorial Stadium",
        type: "game_day"
      }
    ];
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <GraduationCap className="h-3 w-3" />;
      case 'game_day':
        return <Trophy className="h-3 w-3" />;
      case 'campus_event':
        return <Users className="h-3 w-3" />;
      case 'holiday':
        return <Calendar className="h-3 w-3" />;
      case 'deadline':
        return <AlertTriangle className="h-3 w-3" />;
      case 'conductor_recommendation':
        return <Sparkles className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'game_day':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'campus_event':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'holiday':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'deadline':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'conductor_recommendation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Time';
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Time';
    }
  };

  // Calendar grid functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      try {
        const eventDate = new Date(event.start).toISOString().split('T')[0];
        return eventDate === dateString;
      } catch (error) {
        return false;
      }
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const upcomingEvents = events
    .filter(event => {
      try {
        return new Date(event.start) >= new Date();
      } catch (error) {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      } catch (error) {
        return 0;
      }
    })
    .slice(0, 5);

  const renderCalendarGrid = () => {
    try {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDayOfMonth = getFirstDayOfMonth(currentDate);
      const days = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>);
      }

      // Add cells for each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayEvents = getEventsForDate(date);
        
        days.push(
          <div
            key={day}
            className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors ${
              isToday(date) ? 'bg-blue-50 border-blue-300' : ''
            } ${isSelected(date) ? 'bg-purple-50 border-purple-300' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            <div className="text-sm font-medium mb-1">{day}</div>
            <div className="space-y-1">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div
                  key={index}
                  className={`text-xs p-1 rounded truncate ${getEventColor(event.type)}`}
                  title={event.title}
                >
                  <div className="flex items-center gap-1">
                    {getEventIcon(event.type)}
                    <span className="truncate">{event.title}</span>
                  </div>
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-500 text-center">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
      }

      return days;
    } catch (error) {
      console.error('Error rendering calendar grid:', error);
      return <div>Error rendering calendar</div>;
    }
  };

  // Simple fallback render to prevent crashes
  try {
    if (isLoading) {
      return (
        <div className="ml-24 mt-8 relative">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading calendar events...</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="ml-24 mt-8 relative">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Calendar</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchCalendarEvents} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="ml-24 mt-8 relative">
        <div className="flex items-center justify-between mb-8 pr-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-2">Academic calendar, game days, and campus events</p>
            <div className="mt-2 text-xs text-blue-600">
              📊 Data Sources: UC Berkeley Academic Calendar, Events Calendar, Athletics, Career Services, Admissions, Commencement
            </div>
          </div>
          <Button onClick={fetchCalendarEvents} variant="outline">
            Refresh Calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto pr-8">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prevMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-600 border-b border-gray-200">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {renderCalendarGrid()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Up */}
            <Card>
              <CardHeader>
                <CardTitle>Next Up</CardTitle>
                <CardDescription>Upcoming events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming events</p>
                ) : (
                  upcomingEvents.map((event, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-2 mb-2">
                        {getEventIcon(event.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-gray-600">{formatDate(event.start)}</p>
                        </div>
                        <Badge className={`text-xs ${getEventColor(event.type)}`}>
                          {event.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{event.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTime(event.start)}
                        {event.location && (
                          <>
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </>
                        )}
                      </div>
                      {event.source && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <span>📊 Source:</span>
                            {event.url ? (
                              <a 
                                href={event.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {event.source}
                              </a>
                            ) : (
                              <span>{event.source}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Conductor AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Insider events you might miss</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingConductor ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Finding hidden gems...</p>
                  </div>
                ) : conductorEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm">No AI recommendations yet</p>
                ) : (
                  conductorEvents.map((event, index) => (
                    <div key={index} className="border border-purple-200 rounded-lg p-3 bg-purple-50 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="h-3 w-3 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-purple-900">{event.title}</h4>
                          <p className="text-xs text-purple-700">{event.organizer}</p>
                        </div>
                        <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                          {event.category.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">{event.description}</p>
                      {event.insider_tip && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                          <p className="text-xs text-yellow-800 font-medium">💡 Insider Tip:</p>
                          <p className="text-xs text-yellow-700">{event.insider_tip}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <Clock className="h-3 w-3" />
                        {formatTime(event.start_time)}
                        {event.location && (
                          <>
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full text-xs bg-purple-600 hover:bg-purple-700"
                        onClick={() => addConductorEventToCalendar(event)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add to Calendar
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Upcoming Events</span>
                  <Badge variant="secondary">{upcomingEvents.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Academic Deadlines</span>
                  <Badge variant="secondary">
                    {upcomingEvents.filter(e => e.type === 'academic').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Game Days</span>
                  <Badge variant="secondary">
                    {upcomingEvents.filter(e => e.type === 'game_day').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Campus Events</span>
                  <Badge variant="secondary">
                    {upcomingEvents.filter(e => e.type === 'campus_event').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Recommendations</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {conductorEvents.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Google Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Set Reminders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Share with Friends
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Calendar component error:', error);
    return (
      <div className="ml-24 mt-8 relative">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Calendar Error</h2>
            <p className="text-gray-600 mb-4">Something went wrong loading the calendar</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }
} 
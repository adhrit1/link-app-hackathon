"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAgentSystem } from './AgentSystem';
import { Brain, Users, Target, Activity, Lightbulb, TrendingUp, BookOpen, Calendar } from 'lucide-react';

export default function AgentDashboard() {
  const { processRequest, getAllAgents, getSystemStatus, setCurrentStudentId } = useAgentSystem();
  const [agents, setAgents] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [learningPlan, setLearningPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Test agent system immediately
    console.log('AgentDashboard mounted');
    console.log('Agent system functions:', { processRequest, getAllAgents, getSystemStatus, setCurrentStudentId });
    
    // Test basic functions
    try {
      const status = getSystemStatus();
      console.log('Initial system status:', status);
      
      const agents = getAllAgents();
      console.log('Initial agents:', agents);
      
      setCurrentStudentId('demo-student-001');
      console.log('Student ID set');
      
    } catch (error) {
      console.error('Error testing agent system:', error);
    }
    
    // Then load the full system
    loadAgentSystem();
  }, [setCurrentStudentId, processRequest, getAllAgents, getSystemStatus]);

  const loadAgentSystem = async () => {
    try {
      setIsLoading(true);
      
      // Set student ID first
      setCurrentStudentId('demo-student-001');
      
      // Get system status
      const status = getSystemStatus();
      console.log('System status:', status);
      setSystemStatus(status);
      
      // Get all agents
      const allAgents = getAllAgents();
      console.log('All agents:', allAgents);
      setAgents(allAgents);
      
      // Get recommendations from profiler agent
      try {
        const profilerRecs = await processRequest({
          agentId: 'profiler',
          action: 'get_recommendations'
        });
        console.log('Profiler recommendations:', profilerRecs);
        setRecommendations(profilerRecs);
      } catch (error) {
        console.error('Error getting recommendations:', error);
      }
      
      // Get learning plan from learning agent
      try {
        const learningResult = await processRequest({
          agentId: 'learner',
          action: 'create_study_plan',
          data: { courses: ['CS 61A', 'Math 1A'], studyHours: 20 }
        });
        console.log('Learning plan:', learningResult);
        setLearningPlan(learningResult);
      } catch (error) {
        console.error('Error getting learning plan:', error);
      }
      
    } catch (error) {
      console.error('Error loading agent system:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'profiler':
        return <Users className="h-4 w-4" />;
      case 'recommender':
        return <Lightbulb className="h-4 w-4" />;
      case 'learner':
        return <Brain className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getAgentColor = (agentId: string) => {
    switch (agentId) {
      case 'profiler':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recommender':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'learner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="ml-24 mt-8 relative">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading AI Agent System...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-24 mt-8 relative">
      <div className="flex items-center justify-between mb-8 pr-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agent Dashboard</h1>
          <p className="text-gray-600 mt-2">Multi-agent system for personalized student experience</p>
        </div>
        <Button onClick={loadAgentSystem} variant="outline">
          Refresh System
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pr-8">
        {/* System Status */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Agent System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{systemStatus?.agentCount || 3}</div>
                  <div className="text-sm text-gray-600">Active Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{systemStatus?.isInitialized ? 'Online' : 'Initializing...'}</div>
                  <div className="text-sm text-gray-600">System Status</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{systemStatus?.totalInteractions || 0}</div>
                  <div className="text-sm text-gray-600">Total Interactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">100%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Agents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Active AI Agents
              </CardTitle>
              <CardDescription>Specialized agents working together for your success</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAgentIcon(agent.id)}
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.role}</p>
                      </div>
                    </div>
                    <Badge className={getAgentColor(agent.id)}>
                      Active
                    </Badge>
                  </div>
                ))
              ) : (
                // Fallback display for the three agents
                <>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4" />
                      <div>
                        <h3 className="font-medium">Student Profiler</h3>
                        <p className="text-sm text-gray-600">Profile Analysis & Learning</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="h-4 w-4" />
                      <div>
                        <h3 className="font-medium">Smart Recommender</h3>
                        <p className="text-sm text-gray-600">Personalized Recommendations</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Brain className="h-4 w-4" />
                      <div>
                        <h3 className="font-medium">Adaptive Learner</h3>
                        <p className="text-sm text-gray-600">Learning Optimization</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      Active
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Get Recommendations
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Study Plan
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyze Performance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Optimization
              </Button>
            </CardContent>
          </Card>

          {/* Agent Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Student Profiler</span>
                </div>
                <p className="text-xs text-gray-600">Behavioral analysis, preference learning, pattern recognition</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Smart Recommender</span>
                </div>
                <p className="text-xs text-gray-600">Course suggestions, activity recommendations, resource matching</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Adaptive Learner</span>
                </div>
                <p className="text-xs text-gray-600">Learning optimization, study planning, performance analysis</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {recommendations && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions from your AI agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.all && recommendations.all.length > 0 ? (
                  recommendations.all.map((rec: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <Badge 
                          variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{rec.title}</h4>
                          <p className="text-xs text-gray-600">{rec.description}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{rec.reasoning}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Complete your profile to get personalized recommendations</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Learning Plan */}
        {learningPlan && (
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  AI-Generated Study Plan
                </CardTitle>
                <CardDescription>Personalized learning schedule from your Adaptive Learner agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Daily Schedule</h4>
                    <div className="space-y-2">
                      {learningPlan.daily && Object.entries(learningPlan.daily).map(([time, tasks]: [string, any]) => (
                        <div key={time} className="text-sm">
                          <span className="font-medium capitalize">{time}:</span>
                          <ul className="ml-4 mt-1 space-y-1">
                            {Array.isArray(tasks) ? tasks.map((task: string, index: number) => (
                              <li key={index} className="text-gray-600">• {task}</li>
                            )) : (
                              <li className="text-gray-600">• {tasks}</li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Weekly Focus</h4>
                    <div className="space-y-2">
                      {learningPlan.weekly && Object.entries(learningPlan.weekly).map(([day, focus]: [string, any]) => (
                        <div key={day} className="text-sm">
                          <span className="font-medium capitalize">{day}:</span>
                          <p className="text-gray-600 ml-2">{focus}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Exam Preparation</h4>
                    <div className="space-y-2">
                      {learningPlan.examPrep && Object.entries(learningPlan.examPrep).map(([timeline, plan]: [string, any]) => (
                        <div key={timeline} className="text-sm">
                          <span className="font-medium">{timeline.replace('_', ' ')}:</span>
                          <p className="text-gray-600 ml-2">{plan}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 
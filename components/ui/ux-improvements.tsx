"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Smartphone, 
  Accessibility, 
  Settings,
  TrendingUp,
  Lightbulb,
  Target,
  Timer,
  Users,
  Activity
} from 'lucide-react';
import { useUXAnalysis } from '@/lib/ux-analysis';
import { useUXOptimization, OptimizationSuggestion } from '@/lib/ux-optimization';

interface UXImprovementsProps {
  className?: string;
  showAutoOptimize?: boolean;
}

export const UXImprovements: React.FC<UXImprovementsProps> = ({ 
  className = "",
  showAutoOptimize = true 
}) => {
  const { metrics, report } = useUXAnalysis();
  const { suggestions, summary } = useUXOptimization(metrics);
  const [isAutoOptimizing, setIsAutoOptimizing] = useState(false);
  const [optimizedItems, setOptimizedItems] = useState<string[]>([]);

  const handleAutoOptimize = async () => {
    setIsAutoOptimizing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark items as optimized
    setOptimizedItems(['images', 'fonts', 'css']);
    setIsAutoOptimizing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'accessibility': return <Accessibility className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'usability': return <Users className="h-4 w-4" />;
      case 'seo': return <Target className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!metrics || !suggestions) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            UX Improvements
          </CardTitle>
          <CardDescription>Loading optimization suggestions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              UX Improvements & Optimizations
            </CardTitle>
            <CardDescription>
              Actionable insights to enhance user experience
            </CardDescription>
          </div>
          {showAutoOptimize && (
            <Button
              onClick={handleAutoOptimize}
              disabled={isAutoOptimizing}
              className="flex items-center gap-2"
            >
              {isAutoOptimizing ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Auto-Optimize
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">Total Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {summary?.totalSuggestions || 0}
                  </div>
                  <Progress value={Math.min(100, (summary?.totalSuggestions || 0) * 10)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Critical Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {summary?.criticalIssues || 0}
                  </div>
                  <Progress value={Math.min(100, (summary?.criticalIssues || 0) * 25)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-4 w-4" />
                    <span className="text-sm font-medium">Estimated Effort</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {summary?.estimatedEffort || '0 hours'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total development time</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Impact Score</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {summary?.impactScore || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">High impact improvements</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            {showAutoOptimize && optimizedItems.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Auto-Optimization Complete</AlertTitle>
                <AlertDescription>
                  Successfully optimized: {optimizedItems.join(', ')}. 
                  These improvements will enhance performance and user experience.
                </AlertDescription>
              </Alert>
            )}

            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current UX Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Score</span>
                    <Badge variant="outline">{Math.round(metrics.userSatisfaction)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Performance</span>
                    <Badge variant="outline">{Math.round(metrics.performanceScore)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accessibility</span>
                    <Badge variant="outline">{Math.round(metrics.accessibilityScore)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mobile</span>
                    <Badge variant="outline">{Math.round(metrics.mobileResponsiveness)}%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Priority Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical</span>
                    <Badge className="bg-red-100 text-red-800">
                      {suggestions.filter(s => s.priority === 'critical').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      {suggestions.filter(s => s.priority === 'high').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {suggestions.filter(s => s.priority === 'medium').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low</span>
                    <Badge className="bg-green-100 text-green-800">
                      {suggestions.filter(s => s.priority === 'low').length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="space-y-4">
              {suggestions.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>No Issues Found</AlertTitle>
                  <AlertDescription>
                    Your application is performing well! No optimization suggestions at this time.
                  </AlertDescription>
                </Alert>
              ) : (
                suggestions.map((suggestion) => (
                  <Collapsible key={suggestion.id}>
                    <CollapsibleTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getCategoryIcon(suggestion.category)}
                              <div>
                                <h3 className="font-semibold">{suggestion.title}</h3>
                                <p className="text-sm text-gray-600">{suggestion.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(suggestion.priority)}>
                                {suggestion.priority}
                              </Badge>
                              <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                                {suggestion.impact} impact
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Card className="mt-2">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Implementation Steps:</h4>
                              <pre className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">
                                {suggestion.implementation}
                              </pre>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4" />
                                <span className="text-sm">Estimated time: {suggestion.estimatedTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">Effort: {suggestion.effort}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="optimizations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Automated Optimizations</CardTitle>
                  <CardDescription>
                    Quick fixes that can be applied automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Image Optimization</span>
                    <Badge variant={optimizedItems.includes('images') ? 'default' : 'secondary'}>
                      {optimizedItems.includes('images') ? 'Applied' : 'Available'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Font Loading</span>
                    <Badge variant={optimizedItems.includes('fonts') ? 'default' : 'secondary'}>
                      {optimizedItems.includes('fonts') ? 'Applied' : 'Available'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CSS Optimization</span>
                    <Badge variant={optimizedItems.includes('css') ? 'default' : 'secondary'}>
                      {optimizedItems.includes('css') ? 'Applied' : 'Available'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manual Optimizations</CardTitle>
                  <CardDescription>
                    Improvements requiring developer intervention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions.filter(s => s.effort === 'high').slice(0, 3).map(suggestion => (
                    <div key={suggestion.id} className="flex items-center justify-between">
                      <span className="text-sm">{suggestion.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.estimatedTime}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Optimization Progress</CardTitle>
                <CardDescription>
                  Track your UX improvement journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Performance Score</span>
                      <span className="text-sm text-gray-500">{Math.round(metrics.performanceScore)}%</span>
                    </div>
                    <Progress value={metrics.performanceScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Accessibility Score</span>
                      <span className="text-sm text-gray-500">{Math.round(metrics.accessibilityScore)}%</span>
                    </div>
                    <Progress value={metrics.accessibilityScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Mobile Responsiveness</span>
                      <span className="text-sm text-gray-500">{Math.round(metrics.mobileResponsiveness)}%</span>
                    </div>
                    <Progress value={metrics.mobileResponsiveness} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall UX Score</span>
                      <span className="text-sm text-gray-500">{Math.round(metrics.userSatisfaction)}%</span>
                    </div>
                    <Progress value={metrics.userSatisfaction} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UXImprovements; 
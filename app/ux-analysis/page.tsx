"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  TrendingUp, 
  Lightbulb, 
  BarChart3, 
  Target, 
  Zap,
  Smartphone,
  Accessibility,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import UXDashboard from '@/components/ui/ux-dashboard';
import UXImprovements from '@/components/ui/ux-improvements';
import { useUXAnalysis } from '@/lib/ux-analysis';
import { useUXOptimization } from '@/lib/ux-optimization';

export default function UXAnalysisPage() {
  const { metrics, report } = useUXAnalysis();
  const { suggestions, summary } = useUXOptimization(metrics);

  const getOverallStatus = () => {
    if (!metrics) return 'loading';
    if (metrics.userSatisfaction >= 90) return 'excellent';
    if (metrics.userSatisfaction >= 70) return 'good';
    if (metrics.userSatisfaction >= 50) return 'fair';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5" />;
      case 'good': return <TrendingUp className="h-5 w-5" />;
      case 'fair': return <AlertTriangle className="h-5 w-5" />;
      case 'poor': return <AlertTriangle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  if (!metrics) {
    return (
      <div className="ml-24 mt-8 relative">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-600">Loading UX Analysis...</h2>
            <p className="text-gray-500">Gathering comprehensive user experience data</p>
          </div>
        </div>
      </div>
    );
  }

  const status = getOverallStatus();

  return (
    <div className="ml-24 mt-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pr-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">UX Analysis & Optimization</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive user experience analysis and improvement recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(status)}>
            <div className="flex items-center gap-2">
              {getStatusIcon(status)}
              <span className="capitalize">{status}</span>
            </div>
          </Badge>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pr-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Overall Score</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(metrics.userSatisfaction)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              User satisfaction score
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(metrics.performanceScore)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Load time: {Math.round(metrics.pageLoadTime)}ms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Accessibility className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Accessibility</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(metrics.accessibilityScore)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              WCAG compliance score
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Mobile</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(metrics.mobileResponsiveness)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Mobile responsiveness
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="dashboard" className="w-full pr-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <UXDashboard />
        </TabsContent>

        <TabsContent value="improvements" className="space-y-6">
          <UXImprovements showAutoOptimize={true} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Detailed performance metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Page Load Time</span>
                    <Badge variant="outline">{Math.round(metrics.pageLoadTime)}ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interaction Delay</span>
                    <Badge variant="outline">{Math.round(metrics.interactionDelay)}ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Performance Score</span>
                    <Badge variant="outline">{Math.round(metrics.performanceScore)}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Behavior Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Behavior Analytics
                </CardTitle>
                <CardDescription>
                  User interaction patterns and engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <Badge variant="outline">{metrics.errorRate}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Task Completion</span>
                    <Badge variant="outline">{metrics.taskCompletionRate}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User Satisfaction</span>
                    <Badge variant="outline">{Math.round(metrics.userSatisfaction)}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5" />
                  Accessibility Analytics
                </CardTitle>
                <CardDescription>
                  Accessibility compliance and improvements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accessibility Score</span>
                    <Badge variant="outline">{Math.round(metrics.accessibilityScore)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Contrast Ratio</span>
                    <Badge variant="outline">4.5:1</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Keyboard Navigation</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Analytics
                </CardTitle>
                <CardDescription>
                  Mobile responsiveness and optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mobile Score</span>
                    <Badge variant="outline">{Math.round(metrics.mobileResponsiveness)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Touch Targets</span>
                    <Badge variant="outline">Optimized</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Responsive Design</span>
                    <Badge variant="outline">Implemented</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Key Insights
                </CardTitle>
                <CardDescription>
                  Important findings and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions && suggestions.length > 0 ? (
                  <div className="space-y-3">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={suggestion.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            {suggestion.priority}
                          </Badge>
                          <span className="text-sm font-medium">{suggestion.title}</span>
                        </div>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Critical Issues</h3>
                    <p className="text-gray-600">Your application is performing well across all metrics!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Optimization Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Optimization Summary
                </CardTitle>
                <CardDescription>
                  Summary of improvement opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Suggestions</span>
                      <Badge variant="outline">{summary.totalSuggestions}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical Issues</span>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {summary.criticalIssues}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Priority</span>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        {summary.highPriorityIssues}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estimated Effort</span>
                      <Badge variant="outline">{summary.estimatedEffort}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Impact Score</span>
                      <Badge variant="outline">{summary.impactScore}</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimization Ready</h3>
                    <p className="text-gray-600">Ready to analyze and optimize your application!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
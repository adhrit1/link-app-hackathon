"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Smartphone, 
  Accessibility, 
  Zap,
  Activity
} from 'lucide-react';
import { useUXAnalysis } from '@/lib/ux-analysis';

export const UXDashboard: React.FC = () => {
  const { metrics, report } = useUXAnalysis();

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            UX Analytics
          </CardTitle>
          <CardDescription>Loading UX metrics...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          UX Analytics Dashboard
        </CardTitle>
        <CardDescription>
          Real-time user experience monitoring
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Overall Score</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(metrics.userSatisfaction)}%
              </div>
              <Progress value={metrics.userSatisfaction} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Load Time</span>
              </div>
              <div className={`text-2xl font-bold ${getPerformanceColor(metrics.performanceScore)}`}>
                {Math.round(metrics.pageLoadTime)}ms
              </div>
              <Progress value={Math.min(100, (metrics.pageLoadTime / 3000) * 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-medium">Mobile Score</span>
              </div>
              <div className={`text-2xl font-bold ${getPerformanceColor(metrics.mobileResponsiveness)}`}>
                {Math.round(metrics.mobileResponsiveness)}%
              </div>
              <Progress value={metrics.mobileResponsiveness} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Accessibility className="h-4 w-4" />
                <span className="text-sm font-medium">Accessibility</span>
              </div>
              <div className={`text-2xl font-bold ${getPerformanceColor(metrics.accessibilityScore)}`}>
                {Math.round(metrics.accessibilityScore)}%
              </div>
              <Progress value={metrics.accessibilityScore} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {report && report.recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Recommendations</h3>
            {report.recommendations.map((recommendation, index) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{recommendation}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {report && report.recommendations.length === 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your application is performing well across all UX metrics!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default UXDashboard; 
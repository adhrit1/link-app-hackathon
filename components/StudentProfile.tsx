"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAgentSystem, StudentProfile as StudentProfileType, AgentRecommendation } from './AgentSystem';
import { User, GraduationCap, Target, Heart, Brain, Users, Activity } from 'lucide-react';

export default function StudentProfileComponent() {
  const { processRequest, setCurrentStudentId, currentStudentId } = useAgentSystem();
  const [profile, setProfile] = useState<StudentProfileType | null>(null);
  const [recommendations, setRecommendations] = useState<AgentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<StudentProfileType>>({});

  // Set a default student ID for demo purposes
  useEffect(() => {
    setCurrentStudentId('demo-student-001');
  }, [setCurrentStudentId]);

  // Load profile after student ID is set
  useEffect(() => {
    if (currentStudentId) {
      loadProfile();
    }
  }, [currentStudentId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      console.log('Loading profile for student:', currentStudentId);
      
      const result = await processRequest({
        agentId: 'profiler',
        action: 'get_profile'
      });
      console.log('Profile result:', result);
      setProfile(result);
      
      // Load recommendations
      const recResult = await processRequest({
        agentId: 'profiler',
        action: 'get_recommendations'
      });
      console.log('Recommendations result:', recResult);
      setRecommendations(recResult.all || []);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setIsLoading(true);
      const result = await processRequest({
        agentId: 'profiler',
        action: 'update_profile',
        data: formData
      });
      
      if (result.success) {
        setProfile(result.profile);
        setIsEditing(false);
        
        // Reload recommendations after profile update
        const recResult = await processRequest({
          agentId: 'profiler',
          action: 'get_recommendations'
        });
        setRecommendations(recResult.all || []);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalsChange = (category: 'academic' | 'career' | 'personal', goals: string[]) => {
    setFormData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [category]: goals
      }
    }));
  };

  const handleInterestsChange = (interests: string[]) => {
    setFormData(prev => ({
      ...prev,
      interests
    }));
  };

  const startEditing = () => {
    setFormData(profile || {});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData({});
    setIsEditing(false);
  };

  if (isLoading && !profile) {
    return (
      <div className="ml-24 mt-8 relative">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading student profile...</p>
            <p className="text-sm text-gray-500 mt-2">Student ID: {currentStudentId || 'Not set'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-24 mt-8 relative">
      <div className="flex items-center justify-between mb-8 pr-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-600 mt-2">Your personalized academic and social profile</p>
          <p className="text-xs text-gray-400 mt-1">Student ID: {currentStudentId || 'Not set'}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <Button onClick={startEditing} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pr-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="major">Major</Label>
                    <Select value={formData.major || ''} onValueChange={(value) => handleInputChange('major', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Undeclared">Undeclared</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Psychology">Psychology</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Select value={formData.year || ''} onValueChange={(value) => handleInputChange('year', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Freshman">Freshman</SelectItem>
                        <SelectItem value="Sophomore">Sophomore</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={formData.gpa || ''}
                      onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm text-gray-600">{profile?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>Major</Label>
                    <p className="text-sm text-gray-600">{profile?.major || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>Year</Label>
                    <p className="text-sm text-gray-600">{profile?.year || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>GPA</Label>
                    <p className="text-sm text-gray-600">{profile?.gpa || 'Not set'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Learning Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Study Style</Label>
                    <Select value={formData.studyStyle || ''} onValueChange={(value) => handleInputChange('studyStyle', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select study style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="group">Group</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Activity Level</Label>
                    <Select value={formData.activityLevel || ''} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Study Style</Label>
                    <Badge variant="secondary">{profile?.studyStyle || 'Not set'}</Badge>
                  </div>
                  <div>
                    <Label>Activity Level</Label>
                    <Badge variant="secondary">{profile?.activityLevel || 'Not set'}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div>
                  <Label>Interests (comma-separated)</Label>
                  <Input
                    value={formData.interests?.join(', ') || ''}
                    onChange={(e) => handleInterestsChange(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    placeholder="e.g., Programming, Music, Sports"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile?.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">{interest}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No interests added yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Academic Goals</Label>
                    <Textarea
                      value={formData.goals?.academic?.join('\n') || ''}
                      onChange={(e) => handleGoalsChange('academic', e.target.value.split('\n').filter(s => s.trim()))}
                      placeholder="Enter your academic goals..."
                    />
                  </div>
                  <div>
                    <Label>Career Goals</Label>
                    <Textarea
                      value={formData.goals?.career?.join('\n') || ''}
                      onChange={(e) => handleGoalsChange('career', e.target.value.split('\n').filter(s => s.trim()))}
                      placeholder="Enter your career goals..."
                    />
                  </div>
                  <div>
                    <Label>Personal Goals</Label>
                    <Textarea
                      value={formData.goals?.personal?.join('\n') || ''}
                      onChange={(e) => handleGoalsChange('personal', e.target.value.split('\n').filter(s => s.trim()))}
                      placeholder="Enter your personal goals..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Academic Goals</Label>
                    <div className="space-y-1">
                      {profile?.goals?.academic && profile.goals.academic.length > 0 ? (
                        profile.goals.academic.map((goal, index) => (
                          <p key={index} className="text-sm text-gray-600">• {goal}</p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No academic goals set</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Career Goals</Label>
                    <div className="space-y-1">
                      {profile?.goals?.career && profile.goals.career.length > 0 ? (
                        profile.goals.career.map((goal, index) => (
                          <p key={index} className="text-sm text-gray-600">• {goal}</p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No career goals set</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Personal Goals</Label>
                    <div className="space-y-1">
                      {profile?.goals?.personal && profile.goals.personal.length > 0 ? (
                        profile.goals.personal.map((goal, index) => (
                          <p key={index} className="text-sm text-gray-600">• {goal}</p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No personal goals set</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex gap-4">
              <Button onClick={updateProfile} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button onClick={cancelEditing} variant="outline">
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Recommendations Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Personalized suggestions based on your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Complete your profile to get personalized recommendations</p>
              ) : (
                recommendations.map((rec, index) => (
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
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Basic Info</span>
                  <span>{profile?.name && profile?.major !== 'Undeclared' ? '100%' : '50%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${profile?.name && profile?.major !== 'Undeclared' ? 100 : 50}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Complete your profile to unlock more personalized features
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
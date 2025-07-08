"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  BookOpen,
  Edit,
  Save,
  X
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "New Student",
    email: "student@berkeley.edu",
    phone: "",
    major: "Undeclared",
    year: "Freshman",
    gpa: "N/A",
    unitsCompleted: 0,
    expectedGraduation: "2028",
    address: "",
    emergencyContact: "",
    dietaryRestrictions: "",
    interests: [],
    clubs: [],
    achievements: []
  });

  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <div className="flex justify-center">
                <Badge variant="secondary">{profile.year}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.major}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Class of {profile.expectedGraduation}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                    <p>{profile.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p>{profile.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                    <p>{profile.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <p>{profile.address || "Not provided"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      value={editForm.major}
                      onChange={(e) => setEditForm({...editForm, major: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="graduation">Expected Graduation</Label>
                    <Input
                      id="graduation"
                      value={editForm.expectedGraduation}
                      onChange={(e) => setEditForm({...editForm, expectedGraduation: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Major</Label>
                    <p>{profile.major}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Year</Label>
                    <p>{profile.year}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">GPA</Label>
                    <p>{profile.gpa}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Units Completed</Label>
                    <p>{profile.unitsCompleted}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Expected Graduation</Label>
                    <p>Class of {profile.expectedGraduation}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={editForm.emergencyContact}
                      onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                      placeholder="Name and phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dietary">Dietary Restrictions</Label>
                    <Input
                      id="dietary"
                      value={editForm.dietaryRestrictions}
                      onChange={(e) => setEditForm({...editForm, dietaryRestrictions: e.target.value})}
                      placeholder="Any dietary restrictions or preferences"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Emergency Contact</Label>
                    <p>{profile.emergencyContact || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Dietary Restrictions</Label>
                    <p>{profile.dietaryRestrictions || "None specified"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interests and Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Interests & Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Interests</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.interests.length > 0 ? (
                      profile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">{interest}</Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No interests added yet</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Clubs & Organizations</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.clubs.length > 0 ? (
                      profile.clubs.map((club, index) => (
                        <Badge key={index} variant="secondary">{club}</Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No clubs joined yet</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Achievements</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.achievements.length > 0 ? (
                      profile.achievements.map((achievement, index) => (
                        <Badge key={index} variant="default">{achievement}</Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No achievements yet</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
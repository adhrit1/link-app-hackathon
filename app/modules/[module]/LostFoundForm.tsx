"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Image as ImageIcon
} from "lucide-react";

interface LostFoundFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  type: "lost" | "found";
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  images: File[];
  reward?: number;
  tags: string[];
}

const categories = [
  "Electronics",
  "Personal Items", 
  "Academic",
  "Clothing",
  "Jewelry",
  "Other"
];

const commonLocations = [
  "Moffitt Library",
  "Doe Library",
  "RSF (Recreational Sports Facility)",
  "Unit 1 Dorm",
  "Unit 2 Dorm", 
  "Unit 3 Dorm",
  "Blackwell Hall",
  "Stern Hall",
  "Campus",
  "Off-campus",
  "Other"
];

export function LostFoundForm({ onClose, onSuccess }: LostFoundFormProps) {
  const [formData, setFormData] = useState<FormData>(() => ({
    type: "lost",
    title: "",
    description: "",
    category: "",
    location: "",
    date: new Date().toISOString().split('T')[0],
    contact: {
      name: "",
      email: "",
      phone: ""
    },
    images: [],
    tags: []
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Generate AI suggestions based on input
    if (field === 'title' || field === 'description') {
      generateAISuggestions(value, formData[field === 'title' ? 'description' : 'title']);
    }
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const generateAISuggestions = (title: string, description: string) => {
    const text = `${title} ${description}`.toLowerCase();
    const suggestions = [];

    // Location suggestions
    if (text.includes('library') || text.includes('study')) {
      suggestions.push('Moffitt Library', 'Doe Library');
    }
    if (text.includes('gym') || text.includes('workout')) {
      suggestions.push('RSF');
    }
    if (text.includes('dorm') || text.includes('residence')) {
      suggestions.push('Unit 1', 'Unit 2', 'Unit 3', 'Blackwell', 'Stern');
    }

    // Category suggestions
    if (text.includes('phone') || text.includes('laptop')) {
      suggestions.push('Electronics');
    }
    if (text.includes('wallet') || text.includes('key')) {
      suggestions.push('Personal Items');
    }
    if (text.includes('book') || text.includes('textbook')) {
      suggestions.push('Academic');
    }

    setAiSuggestions(suggestions);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert images to base64 for API
      const imagePromises = formData.images.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const imageUrls = await Promise.all(imagePromises);

      const submitData = {
        ...formData,
        images: imageUrls
      };

      const response = await fetch('/api/marketplace/lostfound', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        throw new Error('Failed to submit item');
      }
    } catch (error) {
      console.error('Error submitting lost & found item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Report {formData.type === 'lost' ? 'Lost' : 'Found'} Item
          </CardTitle>
          <CardDescription>
            Help connect lost items with their owners or report found items with AI-powered matching
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.type === 'lost' ? 'default' : 'outline'}
                onClick={() => handleInputChange('type', 'lost')}
                className="flex-1"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Lost Item
              </Button>
              <Button
                type="button"
                variant={formData.type === 'found' ? 'default' : 'outline'}
                onClick={() => handleInputChange('type', 'found')}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Found Item
              </Button>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Item Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Brief description of the item"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Detailed Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed description including brand, color, size, distinguishing features, etc."
                rows={4}
                required
              />
            </div>

            {/* Location and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select location</option>
                  {commonLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">AI Suggestions</label>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map(suggestion => (
                    <Badge
                      key={suggestion}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => addTag(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} <XCircle className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add custom tags (press Enter)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) {
                      addTag(value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                </label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <XCircle className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    value={formData.contact.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="your.email@berkeley.edu"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                  <Input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="(510) 555-0123"
                  />
                </div>
              </div>
            </div>

            {/* Reward (for lost items) */}
            {formData.type === 'lost' && (
              <div>
                <label className="block text-sm font-medium mb-2">Reward (Optional)</label>
                <Input
                  type="number"
                  value={formData.reward || ''}
                  onChange={(e) => handleInputChange('reward', parseFloat(e.target.value) || undefined)}
                  placeholder="Amount in dollars"
                  min="0"
                />
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
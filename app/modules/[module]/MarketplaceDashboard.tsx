"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Plus, 
  Star, 
  MapPin, 
  DollarSign, 
  Clock, 
  User, 
  Heart,
  MessageCircle,
  ExternalLink,
  Package,
  Tag,
  Users,
  TrendingUp,
  Shield,
  Truck,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Camera,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { LostFoundForm } from "./LostFoundForm";

interface ModuleConfig {
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  seller: {
    name: string;
    rating: number;
    isVerified: boolean;
    isStudent: boolean;
  };
  condition: "New" | "Like New" | "Good" | "Fair";
  images: string[];
  location: string;
  postedDate: string;
  views: number;
  likes: number;
  isBookmarked: boolean;
  platform: "student" | "official" | "external";
  externalLink?: string;
  tags?: string[];
  availability: "In Stock" | "Limited" | "Out of Stock";
  shipping?: {
    cost: number;
    method: string;
    estimatedDays: number;
  };
  source?: string;
  source_type?: string;
  source_url?: string;
}

interface LostFoundItem {
  id: string;
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
  images: string[];
  status: "active" | "resolved" | "expired";
  tags?: string[];
  reward?: number;
  isVerified: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

export function MarketplaceDashboard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showLostFoundModal, setShowLostFoundModal] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [activeTab, setActiveTab] = useState<"marketplace" | "lostfound">("marketplace");
  const [lostFoundFilter, setLostFoundFilter] = useState<"all" | "lost" | "found">("all");

  useEffect(() => {
    loadMarketplaceData();
    loadLostFoundData();
  }, []);

  const loadMarketplaceData = async () => {
    setIsLoading(true);
    try {
      // Try to get comprehensive marketplace data first
      const comprehensiveResponse = await fetch('/api/marketplace/comprehensive-data');
      if (comprehensiveResponse.ok) {
        const comprehensiveData = await comprehensiveResponse.json();
        if (comprehensiveData.success && comprehensiveData.items.length > 0) {
          setItems(comprehensiveData.items);
          setTotalItems(comprehensiveData.total_items);
          setIsLoading(false);
          return;
        }
      }
      
      // Try to get enhanced marketplace data
      const enhancedResponse = await fetch('/api/marketplace/enhanced-data');
      if (enhancedResponse.ok) {
        const enhancedData = await enhancedResponse.json();
        if (enhancedData.success && enhancedData.items.length > 0) {
          setItems(enhancedData.items);
          setTotalItems(enhancedData.total_items);
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback to original marketplace data (now with new structure)
      const response = await fetch('/api/marketplace');
      if (response.ok) {
        const data = await response.json();
        console.log('Marketplace data received:', data);
        
        // Handle new data structure with items array and metadata
        const itemsArray = data.items || data;
        const totalCount = data.metadata?.total_items || data.total || itemsArray.length;
        
        // Map the data to include source information
        const mappedItems = itemsArray.map((item: any, index: number) => ({
          id: item.id || `item-${index}`,
          title: item.title,
          description: item.description,
          price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : (item.price || 0),
          category: item.category || "General",
          seller: {
            name: item.author || item.seller?.name || "Unknown",
            rating: item.seller?.rating || 5,
            isVerified: item.seller?.isVerified || false,
            isStudent: item.seller?.isStudent || true
          },
          condition: item.condition || "Good",
          images: item.images || [],
          location: item.location || "UC Berkeley",
          postedDate: item.posted_date || item.postedDate || new Date().toISOString(),
          views: item.views || 0,
          likes: item.likes || 0,
          isBookmarked: false,
          platform: item.platform || "student",
          externalLink: item.url || item.externalLink,
          tags: item.tags || [],
          availability: item.availability || "In Stock",
          source: item.source,
          source_type: item.source_type,
          source_url: item.url
        }));
        
        setItems(mappedItems);
        setTotalItems(totalCount);
        
        // Log data sources if available
        if (data.metadata?.sources) {
          console.log('Data sources:', data.metadata.sources);
        }
      }
    } catch (error) {
      console.error('Error loading marketplace data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLostFoundData = async () => {
    try {
      const response = await fetch('/api/marketplace/lostfound');
      if (response.ok) {
        const data = await response.json();
        setLostFoundItems(data.items || []);
      }
    } catch (error) {
      console.error('Error loading lost & found data:', error);
    }
  };

  const triggerComprehensiveScraping = async () => {
    setIsScraping(true);
    try {
      const response = await fetch('/api/marketplace/comprehensive-scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Comprehensive scraping completed:', result);
        // Reload data after scraping
        await loadMarketplaceData();
      } else {
        console.error('Comprehensive scraping failed');
      }
    } catch (error) {
      console.error('Error triggering comprehensive scraping:', error);
    } finally {
      setIsScraping(false);
    }
  };

  const triggerEnhancedScraping = async () => {
    setIsScraping(true);
    try {
      const response = await fetch('/api/marketplace/enhanced-scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Enhanced scraping completed:', result);
        // Reload data after scraping
        await loadMarketplaceData();
      } else {
        console.error('Enhanced scraping failed');
      }
    } catch (error) {
      console.error('Error triggering enhanced scraping:', error);
    } finally {
      setIsScraping(false);
    }
  };

  const categories: Category[] = [
    { id: "All", name: "All Items", icon: <Package className="h-4 w-4" />, count: items.length, color: "bg-gray-500" },
    { id: "Textbooks", name: "Textbooks", icon: <Tag className="h-4 w-4" />, count: items.filter(i => i.category === "Textbooks").length, color: "bg-blue-500" },
    { id: "Electronics", name: "Electronics", icon: <TrendingUp className="h-4 w-4" />, count: items.filter(i => i.category === "Electronics").length, color: "bg-green-500" },
    { id: "Clothing", name: "Clothing", icon: <Users className="h-4 w-4" />, count: items.filter(i => i.category === "Clothing").length, color: "bg-purple-500" },
    { id: "Study Materials", name: "Study Materials", icon: <Shield className="h-4 w-4" />, count: items.filter(i => i.category === "Study Materials").length, color: "bg-orange-500" },
    { id: "Graduation", name: "Graduation", icon: <Truck className="h-4 w-4" />, count: items.filter(i => i.category === "Graduation").length, color: "bg-red-500" }
  ];

  const platforms = [
    { id: "All", name: "All Platforms", count: items.length },
    { id: "student", name: "Student-to-Student", count: items.filter(i => i.platform === "student").length },
    { id: "official", name: "Official Store", count: items.filter(i => i.platform === "official").length },
    { id: "external", name: "External Platforms", count: items.filter(i => i.platform === "external").length }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesPlatform = selectedPlatform === "All" || item.platform === selectedPlatform;
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const filteredLostFoundItems = lostFoundItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = lostFoundFilter === "all" || item.type === lostFoundFilter;
    
    return matchesSearch && matchesType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "newest":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case "popular":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const sortedLostFoundItems = [...filteredLostFoundItems].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const toggleBookmark = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "student":
        return <Badge variant="outline" className="text-green-600 border-green-600">Student</Badge>;
      case "official":
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Official</Badge>;
      case "external":
        return <Badge variant="outline" className="text-purple-600 border-purple-600">External</Badge>;
      default:
        return null;
    }
  };

  const getSourceBadge = (source?: string, sourceType?: string) => {
    if (!source) return null;
    
    switch (source) {
      case "Cal Student Store":
        return <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">Cal Store</Badge>;
      case "Hype and Vice":
        return <Badge variant="outline" className="text-purple-600 border-purple-600 bg-purple-50">Hype & Vice</Badge>;
      case "Student-to-Student":
        return <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">Student</Badge>;
      case "Depop":
        return <Badge variant="outline" className="text-pink-600 border-pink-600 bg-pink-50">Depop</Badge>;
      case "Amazon":
        return <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">Amazon</Badge>;
      case "Reddit r/berkeley":
        return <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">Reddit</Badge>;
      case "Facebook Marketplace":
        return <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">Facebook</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-600 bg-gray-50">{source}</Badge>;
    }
  };

  const getSourceDescription = (source?: string, sourceType?: string) => {
    if (!source) return null;
    
    switch (source) {
      case "Cal Student Store":
        return "Official UC Berkeley campus store";
      case "Hype and Vice":
        return "Berkeley-focused online retailer";
      case "Student-to-Student":
        return "Direct student seller on this platform";
      case "Depop":
        return "Secondhand fashion marketplace";
      case "Amazon":
        return "Online retail platform";
      case "Reddit r/berkeley":
        return "Community discussion and marketplace";
      case "Facebook Marketplace":
        return "Local buy/sell platform";
      default:
        return "External marketplace";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New":
        return "text-green-600";
      case "Like New":
        return "text-blue-600";
      case "Good":
        return "text-yellow-600";
      case "Fair":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getLostFoundStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>;
      case "resolved":
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Resolved</Badge>;
      case "expired":
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Expired</Badge>;
      default:
        return null;
    }
  };

  const getLostFoundTypeBadge = (type: string) => {
    switch (type) {
      case "lost":
        return <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">Lost</Badge>;
      case "found":
        return <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">Found</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${moduleConfig.bgColor} py-8`}>
      <div className="container mx-auto px-4">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-1">Find and sell items within the Berkeley community</p>
              <div className="mt-2 text-xs text-blue-600">
                📊 Data Sources: Reddit r/berkeley, UC Berkeley Student Marketplace, Student-to-student marketplace
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={triggerComprehensiveScraping}
                disabled={isScraping}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isScraping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isScraping ? "Comprehensive Scraping..." : "Comprehensive Scrape"}
              </Button>
              <Button
                onClick={triggerEnhancedScraping}
                disabled={isScraping}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isScraping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isScraping ? "Scraping..." : "Refresh Data"}
              </Button>
              <Button onClick={() => setShowSellModal(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Sell Item
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "marketplace"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Marketplace ({items.length})
            </button>
            <button
              onClick={() => setActiveTab("lostfound")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "lostfound"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Lost & Found ({lostFoundItems.length})
            </button>
          </div>

          {activeTab === "marketplace" ? (
            <>
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {platforms.map(platform => (
                        <option key={platform.id} value={platform.id}>
                          {platform.name} ({platform.count})
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="relevance">Most Relevant</option>
                      <option value="newest">Newest First</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    {category.icon}
                    {category.name}
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* Marketplace Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getPlatformBadge(item.platform)}
                            {getSourceBadge(item.source, item.source_type)}
                            <Badge variant="outline" className={getConditionColor(item.condition)}>
                              {item.condition}
                            </Badge>
                          </div>
                          
                          {/* Source Description */}
                          {item.source && (
                            <p className="text-xs text-gray-500 mb-2">
                              {getSourceDescription(item.source, item.source_type)}
                            </p>
                          )}
                          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(item.id)}
                          className={item.isBookmarked ? "text-red-500" : "text-gray-400"}
                        >
                          <Heart className={`h-4 w-4 ${item.isBookmarked ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          <span>{item.seller.name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span>{item.seller.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{item.postedDate}</span>
                        </div>
                      </div>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {item.platform === "external" && item.externalLink ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => window.open(item.externalLink, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Platform
                          </Button>
                        ) : (
                          <Button className="flex-1" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Seller
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {sortedItems.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No items found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all categories.</p>
                    <Button onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSelectedPlatform("All");
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <>
              {/* Lost & Found Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Lost & Found Hub</h2>
                  <p className="text-gray-600 mt-1">Report lost items or found items with AI-powered matching</p>
                </div>
                <Button onClick={() => setShowLostFoundModal(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Report Item
                </Button>
              </div>

              {/* Lost & Found Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search lost or found items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <select
                      value={lostFoundFilter}
                      onChange={(e) => setLostFoundFilter(e.target.value as "all" | "lost" | "found")}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Items</option>
                      <option value="lost">Lost Items</option>
                      <option value="found">Found Items</option>
                    </select>
                    
                    <Button variant="outline" className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      AI Image Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Lost & Found Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedLostFoundItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getLostFoundTypeBadge(item.type)}
                            {getLostFoundStatusBadge(item.status)}
                            {item.isVerified && (
                              <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{item.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          <span>{item.contact.name}</span>
                        </div>
                      </div>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {item.reward && (
                        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-800">
                            <DollarSign className="h-3 w-3 inline mr-1" />
                            Reward: ${item.reward}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {sortedLostFoundItems.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No lost or found items</h3>
                    <p className="text-gray-600 mb-4">Be the first to report a lost or found item in the community.</p>
                    <Button onClick={() => setShowLostFoundModal(true)}>
                      Report Item
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sell Modal Placeholder */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Sell Your Item</CardTitle>
              <CardDescription>
                List your item for sale to other Berkeley students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-600">
                This feature is coming soon! You'll be able to upload photos, set prices, and connect with buyers.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowSellModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowSellModal(false)}>
                  Got it
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lost & Found Modal */}
      {showLostFoundModal && (
        <LostFoundForm
          onClose={() => setShowLostFoundModal(false)}
          onSuccess={() => {
            loadLostFoundData();
            setShowLostFoundModal(false);
          }}
        />
      )}
    </div>
  );
} 
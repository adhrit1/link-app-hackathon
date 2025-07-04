"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, Plus, Database, Check } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { TextShimmer } from "@/components/ui/text-shimmer";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define type for API brand rankings response
type APIBrandRanking = {
  id: number;
  created_at: string;
  brand_name: string;
  variations: string;
  rankings: string;
  brand_category: string;
  brand_geo: string;
  uid: string;
};

type APIBrandRankingsResponse = {
  success: boolean;
  count: number;
  results: APIBrandRanking[];
};

export default function KeywordsPage() {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [geo, setGeo] = useState("");
  const [brandUrl, setBrandUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [brandRankings, setBrandRankings] = useState<APIBrandRanking[]>([]);
  const { user } = useAuth();
  
  // Loading step state for cycling through phrases
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // State to control dialog visibility
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Loading phrases to cycle through
  const loadingPhrases = [
    "Analyzing keyword visibility...",
    "Indexing brand mentions...",
    "Calculating visibility score..."
  ];
  
  // Cycle through loading phrases
  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        // Mark the current step as completed
        if (prev < loadingPhrases.length - 1) {
          setCompletedSteps(steps => [...steps, prev]);
        }
        // Move to the next step or loop back to first
        return (prev + 1) % loadingPhrases.length;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isLoading, loadingPhrases.length]);
  
  // Fetch brand rankings for the logged-in user
  useEffect(() => {
    const fetchBrandRankings = async () => {
      if (!user) return;
      
      setIsFetching(true);
      try {
        // Fetch from API endpoint
        const response = await fetch(`https://llm-visibility-backend.vercel.app/api/get-user-brand-rankings?uid=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        if (response.ok) {
          const apiData: APIBrandRankingsResponse = await response.json();
          if (apiData.success && apiData.results) {
            setBrandRankings(apiData.results);
            console.log("API Brand Rankings:", apiData.results);
          }
        } else {
          console.error("Error fetching API brand rankings:", response.statusText);
        }
      } catch (error) {
        console.error("Error in fetch operation:", error);
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchBrandRankings();
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    
    try {
      console.log("Submitting data:", { category, brand, geo, uid: user?.id || "", brandUrl });
      
      const response = await fetch("https://llm-visibility-backend.vercel.app/api/get-brand-rankings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          brand,
          geo,
          uid: user?.id || "",
          brandUrl
        }),
      });
      
      if (!response.ok) {
        // Get more details about the error
        const errorText = await response.text().catch(() => "Failed to get error details");
        console.error(`Error response from server: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Response data:", data);
      
      // Refresh brand rankings after successful submission
      if (user) {
        // Refresh the API brand rankings
        const apiResponse = await fetch(`https://llm-visibility-backend.vercel.app/api/get-user-brand-rankings?uid=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        if (apiResponse.ok) {
          const apiData: APIBrandRankingsResponse = await apiResponse.json();
          if (apiData.success && apiData.results) {
            setBrandRankings(apiData.results);
          }
        }
      }
      
      // Close the dialog when the response is successful
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error("Error submitting keyword:", error);
      // Handle error here (e.g., show error message)
      alert(`Error submitting keyword: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse rankings to get visibility score
  const getVisibilityScore = (rankingsJson: string) => {
    try {
      const rankings = JSON.parse(rankingsJson);
      if (rankings.visibility_score) {
        return rankings.visibility_score.percentage || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error parsing rankings JSON:", error);
      return 0;
    }
  };

  // Get appearance rate from rankings
  const getAppearanceRate = (rankingsJson: string) => {
    try {
      const rankings = JSON.parse(rankingsJson);
      if (rankings.visibility_score && rankings.visibility_score.appearanceRate) {
        return rankings.visibility_score.appearanceRate;
      }
      return "0/0 (0%)";
    } catch (error) {
      console.error("Error parsing rankings JSON for appearance rate:", error);
      return "0/0 (0%)";
    }
  };

  // Capitalize first letter of each word
  const capitalize = (str: string) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Check if user has any brand rankings
  const hasKeywords = brandRankings.length > 0;

  return (
    <div className="pt-8">
      <div className="flex items-center justify-between pl-[5rem] pr-8">
        <div className="text-3xl font-bold">Keywords</div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer" data-dialog-trigger onClick={() => setIsDialogOpen(true)}>Test new keyword</Button>
          </DialogTrigger>
          <DialogContent className="min-h-[400px]">
            <DialogHeader>
              <DialogTitle>Test New Keyword</DialogTitle>
              <DialogDescription>
                Enter brand details to test rankings.
              </DialogDescription>
            </DialogHeader>
            
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 px-10">
                <div className="w-full max-w-md space-y-8">
                  {loadingPhrases.map((phrase, index) => (
                    <div 
                      key={index}
                      className={`flex items-center transition-all duration-500 ease-in-out ${
                        currentStep === index 
                          ? 'opacity-100 transform translate-y-0' 
                          : completedSteps.includes(index)
                          ? 'opacity-70'
                          : 'opacity-30'
                      }`}
                    >
                      {completedSteps.includes(index) && (
                        <Check className="mr-3 h-6 w-6 text-green-500 flex-shrink-0" />
                      )}
                      
                      {currentStep === index ? (
                        <TextShimmer 
                          className="text-xl font-semibold"
                          duration={1.5}
                        >
                          {phrase}
                        </TextShimmer>
                      ) : (
                        <span className={`text-xl font-semibold ${
                          completedSteps.includes(index) ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          {phrase}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
              <div className={`transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <label className={`flex flex-col gap-1 ${isLoading ? 'invisible h-0' : ''}`}>
                  <span className="font-medium">Brand</span>
                  <input
                    type="text"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    placeholder="Enter brand name (e.g. In-N-Out)"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isLoading}
                  />
                </label>
                <label className={`flex flex-col gap-1 mt-4 ${isLoading ? 'invisible h-0' : ''}`}>
                  <span className="font-medium">Category</span>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="Enter category (e.g. burger joint)"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isLoading}
                  />
                </label>
                <label className={`flex flex-col gap-1 mt-4 ${isLoading ? 'invisible h-0' : ''}`}>
                  <span className="font-medium">Geographic Location</span>
                  <input
                    type="text"
                    value={geo}
                    onChange={e => setGeo(e.target.value)}
                    placeholder="Enter location (e.g. Los Angeles, CA)"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isLoading}
                  />
                </label>
                <label className={`flex flex-col gap-1 mt-4 ${isLoading ? 'invisible h-0' : ''}`}>
                  <span className="font-medium">Brand URL</span>
                  <input
                    type="url"
                    value={brandUrl}
                    onChange={e => setBrandUrl(e.target.value)}
                    placeholder="Enter brand website URL"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                  />
                </label>
              </div>
              
              {!isLoading && (
                <Button 
                  type="submit" 
                  className="self-end cursor-pointer mt-4"
                  disabled={isLoading}
                >
                  Test
                </Button>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="px-[5rem] py-8 relative mt-16">
        {isFetching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : !hasKeywords ? (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-lg">
            <EmptyState
              title="No keywords yet"
              description="Add your first keyword to start tracking it across the web."
              icons={[Search, Plus, Database]}
              action={{
                label: "Add Keyword",
                onClick: () => {
                  const dialogTrigger = document.querySelector("[data-dialog-trigger]");
                  if (dialogTrigger instanceof HTMLElement) {
                    dialogTrigger.click();
                  }
                }
              }}
            />
          </div>
        ) : (
          <Table>
            <TableCaption>
              Your tracked keywords and their rankings
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base">Brand</TableHead>
                <TableHead className="text-base">Category</TableHead>
                <TableHead className="text-base">Location</TableHead>
                <TableHead className="text-base">Visibility Score</TableHead>
                <TableHead className="text-base">Appearance Rate</TableHead>
                <TableHead className="text-base">Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Display API brand rankings */}
              {brandRankings.map((item) => (
                <TableRow key={`api-${item.id}`} className="hover:bg-slate-100/50">
                  <TableCell className="font-medium text-base">{capitalize(item.brand_name)}</TableCell>
                  <TableCell className="text-base">{capitalize(item.brand_category)}</TableCell>
                  <TableCell className="text-base">{capitalize(item.brand_geo)}</TableCell>
                  <TableCell className="text-base font-semibold">{`${getVisibilityScore(item.rankings)}%`}</TableCell>
                  <TableCell className="text-base">{getAppearanceRate(item.rankings)}</TableCell>
                  <TableCell className="text-base">{new Date(item.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
} 
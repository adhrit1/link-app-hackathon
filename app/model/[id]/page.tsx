'use client';

import { useEffect, useState, use } from 'react';
import { AppHeader } from '@/components/app-header';
import { ExcelGrid } from '@/app/components/ExcelGrid';
import { ModelAreaChart } from '@/app/components/ModelAreaChart';
import { ModelRadialChart } from '@/app/components/ModelRadialChart';
import { ModelBarChart } from '@/app/components/ModelBarChart';
import { ModelCompositeChart } from '@/app/components/ModelCompositeChart';
import { Skeleton } from "@/components/ui/skeleton";

interface ModelData {
  success: boolean;
  model: {
    id: number;
    uuid: string;
    created_at: string;
    model_info: {
      timing: {
        combine_sheets_seconds: number;
        total_generation_seconds: number;
        cash_flow_generation_seconds: number;
        assumptions_generation_seconds: number;
        balance_sheet_generation_seconds: number;
        summary_stats_generation_seconds: number;
        income_statement_generation_seconds: number;
      };
      model_id: string;
      generated_at: string;
      project_prompt: string;
    };
    model: {
      sheets: {
        cash_flow: { [key: string]: string | number };
        assumptions: { [key: string]: string | number | null };
        balance_sheet: { [key: string]: string | number };
      };
    };
  };
}

interface ModelPageProps {
  params: Promise<{
    id: string;
  }>;
}

function LoadingState() {
  return (
    <div className="space-y-6">
      {/* Top charts grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card">
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-[150px]" /> {/* Title */}
              <Skeleton className="h-3 w-[100px]" /> {/* Subtitle */}
              <Skeleton className="h-[180px] w-full mt-4" /> {/* Chart area */}
            </div>
          </div>
        ))}
      </div>

      {/* Excel grid skeleton */}
      <div className="overflow-hidden border rounded-lg">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-4 w-[120px]" /> {/* Sheet name */}
            <Skeleton className="h-4 w-[100px]" /> {/* Controls */}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex space-x-4">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-8 w-full" /> /* Excel cells */
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Composite chart skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[200px]" /> {/* Chart title */}
              <Skeleton className="h-4 w-[300px]" /> {/* Chart description */}
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-[100px]" /> {/* Metric 1 */}
              <Skeleton className="h-12 w-[100px]" /> {/* Metric 2 */}
            </div>
          </div>
          <Skeleton className="h-[250px] w-full mt-4" /> {/* Chart area */}
        </div>
      </div>
    </div>
  );
}

export default function ModelPage({ params }: ModelPageProps) {
  if (!params) {
    throw new Error('No params provided to ModelPage');
  }

  const { id } = use(params);
  
  if (!id) {
    throw new Error('No model ID provided');
  }

  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const apiUrl = `https://zephea-api.vercel.app/api/get_model_by_id?id=${id}`;
        
        // Log the request
        console.log(`[Model ${id}] Fetching from ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        // Log the response status and headers
        console.log(`[Model ${id}] Response status:`, response.status);
        console.log(`[Model ${id}] Response headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          // Try to get error details from response
          let errorDetails = '';
          try {
            const errorData = await response.json();
            errorDetails = JSON.stringify(errorData);
          } catch (e) {
            errorDetails = await response.text();
          }

          throw new Error(
            `API request failed with status ${response.status}: ${response.statusText}\nDetails: ${errorDetails}`
          );
        }

        const data = await response.json();
        
        // Log the response data
        console.log(`[Model ${id}] Response data:`, data);

        // Validate data structure
        if (!data?.model) {
          throw new Error(`Invalid model data structure - missing model property: ${JSON.stringify(data)}`);
        }

        if (!data.model?.model?.sheets) {
          throw new Error(`Invalid model data structure - missing sheets property: ${JSON.stringify(data.model)}`);
        }

        setModelData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`[Model ${id}] Error:`, err);
        console.error(`[Model ${id}] Stack:`, err instanceof Error ? err.stack : 'No stack available');
        setError(errorMessage);
        
        // Report error to your error tracking service if available
        // reportError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModelData();
  }, [id]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('Model data state changed:', modelData);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [modelData, loading, error]);

  // Debug logging for render conditions
  console.log('Render conditions:', {
    loading,
    error: error !== null,
    hasModelData: modelData !== null,
    sheetsAvailable: modelData?.model?.model?.sheets !== undefined
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex-none">
        <AppHeader 
          breadcrumbs={[
            { title: "Models", href: "/all-models" },
            { title: loading ? `Model ${id}` : (modelData?.model?.name || `Model ${id}`) }
          ]}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <div className="container mx-auto p-6">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <div className="text-red-500">
                <p>Error: {error}</p>
                <pre className="mt-2 p-2 bg-red-50 rounded text-sm">
                  {JSON.stringify({ error, modelData }, null, 2)}
                </pre>
              </div>
            ) : (
              <>
                {console.log('Rendering model content with data:', modelData)}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ModelAreaChart />
                  <ModelRadialChart />
                  <ModelBarChart />
                </div>

                <div className="overflow-hidden border rounded-lg">
                  {modelData?.model?.model?.sheets ? (
                    <div className="h-[600px] overflow-hidden">
                      {console.log('Rendering ExcelGrid with sheets:', modelData.model.model.sheets)}
                      <ExcelGrid 
                        sheets={modelData.model.model.sheets} 
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <p>No sheet data available</p>
                  )}
                </div>

                <div className="mt-6">
                  <ModelCompositeChart />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
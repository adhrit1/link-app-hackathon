"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function OnboardingPage() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  function validateUrl(value: string) {
    // Simple URL validation
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter your brand URL");
      return;
    }
    if (!validateUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }
    setError("");
    setLoading(true);
    console.log("Analyzing URL:", url);

    try {
      const response = await fetch(
        "https://llm-visibility-backend.vercel.app/api/analysis_processes/get-products-from-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            url,
            uuid: user?.id 
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze brand");
      }

      const data = await response.json();
      console.log("Analysis result:", data);
      router.push("/gpt-shopping");
    } catch (error) {
      console.error("Analysis error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-black dark:to-gray-900">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-10 max-w-md w-full">
        <div className="text-center mb-6">
          <p className="text-gray-500 dark:text-gray-400">
            Let&apos;s start by analyzing your brand&apos;s website.
          </p>
        </div>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your brand URL"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze My Brand"}
          </Button>
        </form>
      </div>
    </div>
  );
} 
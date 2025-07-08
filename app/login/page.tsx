"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUI } from "@/components/ui/auth-ui";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  if (user) {
    router.replace("/");
    return null;
  }

  // Fake login handler - accepts any credentials
  async function handleSignIn({ email, password }: { email: string; password: string }) {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fake successful login - redirect to dashboard
      router.replace("/");
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Fake signup handler - accepts any credentials
  async function handleSignUp({ name, email, password }: { name: string; email: string; password: string }) {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fake successful signup - redirect to dashboard
      router.replace("/");
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Render AuthUI with fake authentication
  return (
    <AuthUI onSignIn={handleSignIn} onSignUp={handleSignUp} loading={loading} error={error} />
  );
} 
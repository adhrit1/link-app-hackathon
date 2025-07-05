"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUI } from "@/components/ui/auth-ui";
import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  if (user) {
    router.replace("/");
    return null;
  }

  // Custom form handlers to inject into AuthUI
  async function handleSignUp({ name, email, password }: { name: string; email: string; password: string }) {
    setLoading(true);
    setError(null);
    
    try {
      if (supabaseClient?.auth?.signUp) {
        const { error } = await supabaseClient.auth.signUp({ email, password, options: { data: { name } } });
        if (error) {
          setError(error.message);
        } else {
          router.replace("/");
        }
      } else {
        setError("Authentication service not available");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Render AuthUI with injected logic (will need to pass these to the forms inside AuthUI)
  return (
    <AuthUI onSignUp={handleSignUp} loading={loading} error={error} />
  );
} 
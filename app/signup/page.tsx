"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUI } from "@/components/ui/auth-ui";
import { supabase } from "@/lib/supabase";
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
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace("/");
    }
  }

  async function handleSignIn({ email, password }: { email: string; password: string }) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace("/");
    }
  }

  // Render AuthUI with injected logic (will need to pass these to the forms inside AuthUI)
  return (
    <>
      <AuthUI />
      {/* Optionally show error below the form */}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </>
  );
} 
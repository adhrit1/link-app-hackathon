"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "./supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check if auth methods are available
        if (supabaseClient?.auth?.getSession) {
          const { data, error } = await supabaseClient.auth.getSession();
          if (error) {
            console.error("Error in auth.getSession:", error);
            return;
          }
          
          setSession(data.session);
          setUser(data.session?.user ?? null);
        } else {
          console.warn("Supabase auth methods not available");
        }
      } catch (error) {
        console.error("Error loading user session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth listener
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      // Check if onAuthStateChange method is available
      if (supabaseClient?.auth?.onAuthStateChange) {
        const { data } = supabaseClient.auth.onAuthStateChange(
          (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
          }
        );
        subscription = data.subscription;
      } else {
        console.warn("Supabase onAuthStateChange not available");
      }
    } catch (error) {
      console.error("Error setting up auth state change listener:", error);
    }

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      if (supabaseClient?.auth?.signOut) {
        await supabaseClient.auth.signOut();
      } else {
        console.warn("Supabase signOut method not available");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
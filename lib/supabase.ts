'use client';

import { createClient } from '@supabase/supabase-js';

// Check if environment variables are properly set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if both URL and key are provided
let supabase;
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url-here') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Supabase client:', error);
    supabase = null;
  }
} else {
  console.warn('⚠️  Supabase credentials not configured - using mock client');
  supabase = null;
}

// Mock Supabase client for development with all required methods
export const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null }, error: null }),
    signUp: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Return a mock subscription object
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              // Mock unsubscribe function
            }
          }
        }
      };
    }
  }
};

// Export the actual client or mock client
export const supabaseClient = supabase || mockSupabase;

// Helper function to check if user is logged in
export const isUserLoggedIn = async () => {
  if (!supabase) return false;
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}; 
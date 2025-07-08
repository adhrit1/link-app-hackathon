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
let authStateChangeCallback: ((event: string, session: any) => void) | null = null;

export const mockSupabase = {
  auth: {
    getSession: async () => {
      // Check localStorage for stored session
      if (typeof window !== 'undefined') {
        const storedSession = localStorage.getItem('mock-session');
        if (storedSession) {
          return { data: { session: JSON.parse(storedSession) }, error: null };
        }
      }
      return { data: { session: null }, error: null };
    },
    getUser: async () => {
      // Check localStorage for stored session
      if (typeof window !== 'undefined') {
        const storedSession = localStorage.getItem('mock-session');
        if (storedSession) {
          const session = JSON.parse(storedSession);
          return { data: { user: session.user }, error: null };
        }
      }
      return { data: { user: null }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Fake login - always succeed with any email/password
      const mockUser = {
        id: 'mock-user-id',
        email: email,
        user_metadata: {
          name: email.split('@')[0] || 'User'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      };
      
      // Store session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock-session', JSON.stringify(mockSession));
      }
      
      // Trigger auth state change
      if (authStateChangeCallback) {
        setTimeout(() => {
          authStateChangeCallback('SIGNED_IN', mockSession);
        }, 100);
      }
      
      return { data: { user: mockUser, session: mockSession }, error: null };
    },
    signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
      // Fake signup - always succeed with any email/password
      const mockUser = {
        id: 'mock-user-id',
        email: email,
        user_metadata: {
          name: options?.data?.name || email.split('@')[0] || 'User'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      };
      
      // Store session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock-session', JSON.stringify(mockSession));
      }
      
      // Trigger auth state change
      if (authStateChangeCallback) {
        setTimeout(() => {
          authStateChangeCallback('SIGNED_IN', mockSession);
        }, 100);
      }
      
      return { data: { user: mockUser, session: mockSession }, error: null };
    },
    signOut: async () => {
      // Clear session from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mock-session');
      }
      
      // Trigger auth state change
      if (authStateChangeCallback) {
        setTimeout(() => {
          authStateChangeCallback('SIGNED_OUT', null);
        }, 100);
      }
      
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Store the callback for later use
      authStateChangeCallback = callback;
      
      // Return a mock subscription object
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              // Clear the callback
              authStateChangeCallback = null;
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
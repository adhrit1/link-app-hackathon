'use client';

import { createBrowserClient } from '@supabase/ssr';

// Define cookie options type
type CookieOptions = {
  name?: string;
  value?: string;
  maxAge?: number;
  domain?: string;
  path?: string;
  expires?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
        return cookie ? cookie.split('=')[1] : undefined;
      },
      set(name, value, options) {
        // Format the cookie string
        let cookie = `${name}=${value}`;
        
        if (options.expires) {
          cookie += `; expires=${options.expires}`;
        }
        if (options.path) {
          cookie += `; path=${options.path}`;
        }
        if (options.domain) {
          cookie += `; domain=${options.domain}`;
        }
        if (options.secure) {
          cookie += '; secure';
        }
        if (options.sameSite) {
          cookie += `; samesite=${options.sameSite}`;
        }
        
        document.cookie = cookie;
      },
      remove(name, options) {
        // To remove a cookie, set its expiration date to the past
        const cookieOptions = {
          ...options,
          expires: new Date(0).toUTCString()
        };
        this.set(name, '', cookieOptions);
      }
    }
  }
);

// Helper function to check if user is logged in
export const isUserLoggedIn = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}; 
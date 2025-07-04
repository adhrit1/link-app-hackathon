import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for server components
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Array.from(cookieStore.getAll()).map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );
}

/**
 * Get the current user session on the server
 */
export async function getServerSession() {
  const supabase = createServerSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data?.session;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

/**
 * Get the current user on the server
 */
export async function getServerUser() {
  const session = await getServerSession();
  return session?.user || null;
} 
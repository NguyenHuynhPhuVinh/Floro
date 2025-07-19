import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your .env.local file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please check your .env.local file.'
  );
}

/**
 * Supabase client instance configured for the Floro public collaboration platform.
 *
 * Features:
 * - Public access without authentication required
 * - Real-time subscriptions for live collaboration
 * - Anonymous user support for public canvas collaboration
 * - Unlimited file uploads and storage access
 *
 * @see {@link https://supabase.com/docs/reference/javascript/initializing}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No authentication required for public platform
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 20, // Higher rate for active collaboration
    },
  },
});

export default supabase;

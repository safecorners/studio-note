import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || '';

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY) are missing. Please add them in your environment settings.'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasPlaceholderValues =
  (supabaseUrl || '').includes('your-project-id') ||
  (supabaseAnonKey || '').includes('your-anon-key');

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !hasPlaceholderValues,
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

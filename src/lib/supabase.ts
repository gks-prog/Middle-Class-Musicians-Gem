import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // 1. Strict validation to prevent prerender crashes
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.warn("⚠️ Invalid or missing NEXT_PUBLIC_SUPABASE_URL detected. Injecting build-safe fallback.");
    // Injecting structurally valid strings so the build completes
    supabaseUrl = "https://build-safe-fallback.supabase.co";
    supabaseKey = "build-safe-fallback-key";
  }

  // 2. Return the client
  return createBrowserClient(supabaseUrl, supabaseKey);
}

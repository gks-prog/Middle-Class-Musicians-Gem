import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // 1. Safely grab the variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 2. Prevent Vercel build crashes if variables are missing during the build step
  if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase Keys are missing. Check Vercel Environment Variables.");
    
    // Return a dummy client during build so Vercel doesn't fail with Error 1
    return createBrowserClient(
      "https://placeholder-url.supabase.co", 
      "placeholder-anon-key"
    );
  }

  // 3. Return the actual secure client
  return createBrowserClient(supabaseUrl, supabaseKey);
}

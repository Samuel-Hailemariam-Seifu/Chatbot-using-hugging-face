import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if we have real Supabase credentials
const isSupabaseConfigured = supabaseUrl && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'placeholder-anon-key'

if (!isSupabaseConfigured) {
  console.warn('Supabase not properly configured. Using placeholder values.')
}

// Use real values if available, otherwise use placeholders
const url = supabaseUrl || 'https://placeholder.supabase.co'
const anonKey = supabaseAnonKey || 'placeholder-anon-key'
const serviceKey = supabaseServiceKey || anonKey

// Create clients with proper configuration
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// For server-side operations that need elevated permissions
// Log to verify the service key is being used
if (typeof window === 'undefined') {
  console.log('Server-side Supabase Admin initialized:', {
    hasServiceKey: !!supabaseServiceKey,
    serviceKeyPrefix: serviceKey?.substring(0, 20) + '...',
    url: url
  })
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'apikey': serviceKey
    }
  }
})


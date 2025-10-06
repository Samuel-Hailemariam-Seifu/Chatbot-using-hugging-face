import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    GROQ_API_KEY: !!process.env.GROQ_API_KEY,
  }

  const missingVars = Object.entries(envVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  return NextResponse.json({
    status: missingVars.length === 0 ? 'success' : 'error',
    environment: envVars,
    missing: missingVars,
    message: missingVars.length === 0 
      ? 'All environment variables are set!' 
      : `Missing environment variables: ${missingVars.join(', ')}`
  })
}

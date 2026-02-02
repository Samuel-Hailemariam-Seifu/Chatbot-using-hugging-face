'use client'

import { useState, useEffect } from 'react'

export default function SetupPage() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [hfStatus, setHfStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSetup = async () => {
      try {
        // Check environment variables
        const envResponse = await fetch('/api/env-check')
        const envData = await envResponse.json()
        setEnvStatus(envData)

        // Check Hugging Face API
        const hfResponse = await fetch('/api/test-groq')
        const hfData = await hfResponse.json()
        setHfStatus(hfData)
      } catch (error) {
        console.error('Setup check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSetup()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking setup...</p>
        </div>
      </div>
    )
  }

  const isSupabaseConfigured = envStatus?.environment?.NEXT_PUBLIC_SUPABASE_URL && 
    envStatus.environment.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Chatbot Setup Status</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Environment Variables */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Supabase URL:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  envStatus?.environment?.NEXT_PUBLIC_SUPABASE_URL ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {envStatus?.environment?.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Supabase Anon Key:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  envStatus?.environment?.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {envStatus?.environment?.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hugging Face Token:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  envStatus?.environment?.HF_TOKEN ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {envStatus?.environment?.HF_TOKEN ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* API Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">API Status</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Hugging Face API:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  hfStatus?.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {hfStatus?.status === 'success' ? '✅ Working' : '❌ Failed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Supabase:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  isSupabaseConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isSupabaseConfigured ? '✅ Configured' : '⚠️ Not Set Up'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          
          {!isSupabaseConfigured ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Supabase Setup Required</h3>
              <p className="text-yellow-700 mb-3">
                To use the full chatbot with authentication and data persistence, you need to set up Supabase.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-yellow-700">1. Go to <a href="https://supabase.com" target="_blank" className="text-blue-600 hover:underline">supabase.com</a> and create a project</p>
                <p className="text-sm text-yellow-700">2. Get your credentials from Settings → API</p>
                <p className="text-sm text-yellow-700">3. Update your .env.local file</p>
                <p className="text-sm text-yellow-700">4. Run the database schema from supabase-schema.sql</p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-800 mb-2">✅ Supabase Configured</h3>
              <p className="text-green-700">Your Supabase is properly set up! You can now use the full chatbot with authentication.</p>
            </div>
          )}

          <div className="flex space-x-4">
            <a 
              href="/" 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Go to Chatbot
            </a>
            <a 
              href="/demo" 
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Try Demo Version
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

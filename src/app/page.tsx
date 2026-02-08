'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Footer from '@/components/Footer'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
  messages: Message[]
}

interface User {
  id: string
  email: string
  name: string
}

interface PlatformStats {
  totalUsers: number
  totalConversations: number
  totalMessages: number
}

interface UserStats {
  conversationCount: number
  messageCount: number
  totalTokensUsed: number
  model: string
  recentConversations: {
    id: string
    title: string
    created_at: string
    updated_at: string
    messageCount: number
  }[]
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' })
  const [showNewConvoModal, setShowNewConvoModal] = useState(false)
  const [newConvoTitle, setNewConvoTitle] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [platformStats, setPlatformStats] = useState<PlatformStats>({ totalUsers: 0, totalConversations: 0, totalMessages: 0 })
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [statsLoaded, setStatsLoaded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch platform stats on mount
  const fetchStats = useCallback(async (userId?: string) => {
    try {
      const url = userId ? `/api/stats?userId=${userId}` : '/api/stats'
      const response = await fetch(url)
      const data = await response.json()
      if (data.platform) {
        setPlatformStats(data.platform)
      }
      if (data.user) {
        setUserStats(data.user)
      }
      setStatsLoaded(true)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStatsLoaded(true)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Authentication will not work.')
      return
    }

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Initial session check:', { session, error })
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
          }
          setUser(userData)
          await loadConversations(session.user.id)
          fetchStats(session.user.id)
        }
      } catch (error) {
        console.error('Session check error:', error)
      }
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { event, session: session ? 'Session exists' : 'No session' })
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
          }
          setUser(userData)
          await loadConversations(session.user.id)
          fetchStats(session.user.id)
        } else {
          setUser(null)
          setConversations([])
          setCurrentConversation(null)
          setMessages([])
          setUserStats(null)
          fetchStats()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchStats])

  const loadConversations = async (userId: string) => {
    try {
      const response = await fetch(`/api/conversations?userId=${userId}`)
      const data = await response.json()
      if (data.conversations) {
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        alert('Supabase is not configured. Please set up your Supabase credentials in .env.local')
        setIsLoading(false)
        return
      }

      if (!authData.email || !authData.password) {
        alert('Please enter both email and password')
        setIsLoading(false)
        return
      }

      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,
          options: {
            emailRedirectTo: undefined,
            data: {
              name: authData.name || authData.email.split('@')[0]
            }
          }
        })

        if (error) {
          alert(error.message)
          return
        }

        if (data.user) {
          try {
            await supabase.from('users').insert({
              id: data.user.id,
              email: data.user.email,
              name: authData.name || authData.email.split('@')[0]
            })

            await supabase.from('user_settings').insert({
              user_id: data.user.id,
              model: 'llama-3.1-8b-instant',
              temperature: 0.7,
              max_tokens: 1000,
              system_prompt: 'You are a helpful, friendly AI assistant.'
            })
          } catch (dbError) {
            console.error('Database error:', dbError)
          }

          setShowAuth(false)
          setAuthData({ email: '', password: '', name: '' })
        }
      } else if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password
        })

        if (error) {
          console.error('Sign in error details:', {
            message: error.message,
            status: error.status,
            name: error.name
          })
          
          let errorMessage = error.message
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please check your credentials and try again.'
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and confirm your account before signing in.'
          } else if (error.message.includes('User not found')) {
            errorMessage = 'No account found with this email. Please sign up first.'
          }
          
          alert(errorMessage)
          return
        }

        if (data.user) {
          setShowAuth(false)
          setAuthData({ email: '', password: '', name: '' })
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        alert('Failed to sign out. Please try again.')
      } else {
        setUser(null)
        setConversations([])
        setCurrentConversation(null)
        setMessages([])
        setUserStats(null)
      }
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Failed to sign out. Please try again.')
    }
  }

  const startNewConversation = () => {
    if (!user) return
    setShowNewConvoModal(true)
  }

  const createConversationWithTitle = async () => {
    if (!user || !newConvoTitle.trim()) {
      alert('Please enter a conversation title')
      return
    }

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: newConvoTitle.trim()
        })
      })

      const data = await response.json()
      if (data.conversation) {
        setCurrentConversation(data.conversation)
        setMessages([])
        await loadConversations(user.id)
        fetchStats(user.id)
        setShowNewConvoModal(false)
        setNewConvoTitle('')
      } else if (data.error) {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
      alert('Failed to create conversation. Please try again.')
    }
  }

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      const data = await response.json()
      if (data.conversation) {
        setCurrentConversation(data.conversation)
        setMessages(data.conversation.messages || [])
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const deleteConversation = async (conversationId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete conversation')
      }

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }

      if (user) {
        await loadConversations(user.id)
        fetchStats(user.id)
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      alert('Failed to delete conversation. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !user) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      let conversationId = currentConversation?.id
      if (!conversationId) {
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            title: input.trim().substring(0, 50)
          })
        })
        const data = await response.json()
        if (data.conversation) {
          conversationId = data.conversation.id
          setCurrentConversation(data.conversation)
          await loadConversations(user.id)
        }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          conversationId,
          userId: user.id
        }),
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch {
          // If response is not JSON, use default message
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      // Refresh stats after sending message
      fetchStats(user.id)
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.'
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${errorMessage}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Helper: format number with commas
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
  }

  // Helper: time ago
  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(date).toLocaleDateString()
  }

  // ==================== LANDING PAGE (NOT LOGGED IN) ====================
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-slate-900 tracking-tight">
                  ChatBot Pro
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => { setShowAuth(true); setAuthMode('signin') }}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => { setShowAuth(true); setAuthMode('signup') }}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Sign up free
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Auth Modal Overlay */}
        {showAuth && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {authMode === 'signin' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-slate-500 mt-1 text-sm">
                  {authMode === 'signin' ? 'Sign in to continue' : 'Get started for free'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-3">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={authData.name}
                      onChange={(e) => setAuthData({...authData, name: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                      placeholder="Your name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={authData.email}
                    onChange={(e) => setAuthData({...authData, email: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={authData.password}
                    onChange={(e) => setAuthData({...authData, password: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors mt-1"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Please wait...
                    </span>
                  ) : (authMode === 'signin' ? 'Sign in' : 'Create account')}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="text-slate-500 hover:text-slate-900 text-sm transition-colors"
                  >
                    {authMode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div>
            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-16">
              <div className="text-center max-w-3xl mx-auto">
                {platformStats.totalUsers > 0 && (
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-3.5 py-1.5 mb-6 text-sm font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    {formatNumber(platformStats.totalUsers)} users already on the platform
                  </div>
                )}
                
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
                  AI conversations
                  <br />
                  <span className="text-slate-400">that actually help</span>
                </h1>
                
                <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
                  A clean, fast AI chat assistant powered by Groq. Have real conversations,
                  save your history, and get intelligent responses instantly.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
                  <button
                    onClick={() => { setShowAuth(true); setAuthMode('signup') }}
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    Get started for free
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setShowAuth(true); setAuthMode('signin') }}
                    className="text-slate-600 px-6 py-3 rounded-lg text-sm font-medium hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    I already have an account
                  </button>
                </div>

                <p className="text-xs text-slate-400">No credit card required. Free to use.</p>
              </div>

              {/* Chat Preview Window */}
              <div className="max-w-2xl mx-auto mt-16">
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-slate-100">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div>
                    </div>
                    <span className="text-xs text-slate-400 ml-2">ChatBot Pro</span>
                  </div>
                  {/* Chat messages */}
                  <div className="p-5 space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[75%]">
                        <p className="text-sm">Help me write a Python function to parse CSV files efficiently</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[80%]">
                        <p className="text-sm text-slate-700">Here&apos;s an efficient CSV parser using Python&apos;s built-in <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">csv</code> module with type hints and error handling:</p>
                        <div className="mt-2 bg-slate-50 rounded-lg p-3 text-xs font-mono text-slate-600 border border-slate-100">
                          <div><span className="text-blue-600">import</span> csv</div>
                          <div><span className="text-blue-600">from</span> pathlib <span className="text-blue-600">import</span> Path</div>
                          <div className="mt-1"><span className="text-blue-600">def</span> <span className="text-amber-600">parse_csv</span>(filepath: str):</div>
                          <div className="text-slate-400 pl-4">...</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[75%]">
                        <p className="text-sm">Can you add memory-efficient streaming for large files?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[80%]">
                        <p className="text-sm text-slate-700">Absolutely! Here&apos;s a generator-based approach that uses <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">yield</code> to stream rows without loading the entire file into memory...</p>
                      </div>
                    </div>
                  </div>
                  {/* Input */}
                  <div className="px-4 pb-4">
                    <div className="flex gap-2 bg-white rounded-xl border border-slate-200 px-4 py-2.5">
                      <span className="flex-1 text-sm text-slate-400">Ask anything...</span>
                      <div className="bg-slate-900 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Live Platform Stats */}
            <section className="border-y border-slate-100 bg-slate-50/50">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Live platform data</p>
                </div>
                <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
                  {[
                    { value: formatNumber(platformStats.totalUsers), label: 'Registered users', icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-1.053M18 10.5a3 3 0 11-6 0 3 3 0 016 0zm-9-3a3 3 0 11-6 0 3 3 0 016 0z" />
                    )},
                    { value: formatNumber(platformStats.totalConversations), label: 'Conversations', icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    )},
                    { value: formatNumber(platformStats.totalMessages), label: 'Messages sent', icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    )},
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <svg className="w-5 h-5 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {stat.icon}
                      </svg>
                      <div className="text-2xl font-bold text-slate-900 tabular-nums">
                        {statsLoaded ? stat.value : '—'}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center mb-14">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Built for real conversations
                </h2>
                <p className="text-slate-500 max-w-lg mx-auto">
                  Everything you need to have productive AI conversations, nothing you don&apos;t.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Powered by Groq',
                    description: 'Ultra-fast inference with Groq\'s LPU technology. Get responses in milliseconds, not seconds.',
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    ),
                  },
                  {
                    title: 'Persistent history',
                    description: 'Every conversation is saved to your account. Pick up right where you left off, on any device.',
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ),
                  },
                  {
                    title: 'Secure by default',
                    description: 'Your data is encrypted and stored with Supabase. Row-level security ensures only you see your chats.',
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    ),
                  },
                ].map((feature, i) => (
                  <div key={i} className="p-6 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {feature.icon}
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How it works */}
            <section className="border-t border-slate-100 bg-slate-50/50">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-14">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                    Get started in 30 seconds
                  </h2>
                  <p className="text-slate-500">No complex setup. Just sign up and start chatting.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                  {[
                    { step: '01', title: 'Create an account', description: 'Sign up with your email. Takes less than 10 seconds.' },
                    { step: '02', title: 'Start a conversation', description: 'Create a new conversation and ask your first question.' },
                    { step: '03', title: 'Get instant answers', description: 'Get AI-powered responses with your full conversation history saved.' },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-4xl font-bold text-slate-200 mb-3">{item.step}</div>
                      <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="bg-slate-900 rounded-2xl px-8 py-14 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Ready to start?
                </h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Join {platformStats.totalUsers > 0 ? formatNumber(platformStats.totalUsers) + ' users' : 'others'} already
                  having smarter conversations.
                </p>
                <button
                  onClick={() => { setShowAuth(true); setAuthMode('signup') }}
                  className="bg-white text-slate-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  Create free account
                </button>
              </div>
            </section>

            <Footer />
          </div>
      </div>
    )
  }

  // ==================== CHAT INTERFACE (LOGGED IN) ====================
  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-slate-50 border-r border-slate-200 flex flex-col h-full fixed left-0 top-0 transition-all duration-200 overflow-hidden z-30`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-900">ChatBot Pro</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* User info */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 bg-white rounded-lg border border-slate-100">
            <div className="w-7 h-7 bg-slate-900 rounded-md flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors flex-shrink-0"
              title="Sign Out"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* New Conversation Button */}
        <div className="p-3">
          <button
            onClick={startNewConversation}
            className="w-full bg-slate-900 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New conversation
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider px-2 mb-2">History</p>
          <div className="space-y-0.5">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative w-full text-left px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentConversation?.id === conversation.id
                    ? 'bg-white border border-slate-200 shadow-sm'
                    : 'hover:bg-white/60'
                }`}
              >
                <button
                  onClick={() => loadConversation(conversation.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${
                      currentConversation?.id === conversation.id ? 'text-slate-900' : 'text-slate-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-900 truncate font-medium">{conversation.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {timeAgo(conversation.updated_at)}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={(e) => deleteConversation(conversation.id, e)}
                  className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-red-50"
                  title="Delete"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {conversations.length === 0 && (
              <p className="text-xs text-slate-400 px-2 py-4 text-center">No conversations yet</p>
            )}
          </div>
        </div>

        {/* Sidebar footer stats */}
        {userStats && (
          <div className="p-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>{userStats.conversationCount} chats</span>
              <span>{userStats.messageCount} messages</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white h-full overflow-hidden transition-all duration-200 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-slate-100 px-5 py-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!sidebarOpen && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors mr-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  )}
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">{currentConversation.title}</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {messages.length} messages &middot; {timeAgo(currentConversation.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-md">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[11px] text-emerald-700 font-medium">Online</span>
                  </div>
                  <button
                    onClick={() => deleteConversation(currentConversation.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete conversation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5 min-h-0">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2.5`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-medium ${
                      message.role === 'user' 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {message.role === 'user' ? user.name.charAt(0).toUpperCase() : 'AI'}
                    </div>
                    
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-slate-900 text-white rounded-2xl rounded-br-md'
                          : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-[11px] font-medium">
                      AI
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 p-4 bg-white flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <span className="hidden sm:inline">Send</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          /* ==================== DASHBOARD (No conversation selected) ==================== */
          <div className="flex-1 overflow-y-auto">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="fixed top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <div className="max-w-2xl mx-auto px-6 py-10">
              {/* Welcome section */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  Welcome back, {user.name.split(' ')[0]}
                </h1>
                <p className="text-sm text-slate-500">
                  {userStats && userStats.conversationCount > 0 
                    ? `You have ${userStats.conversationCount} conversation${userStats.conversationCount === 1 ? '' : 's'} and ${userStats.messageCount} messages.`
                    : 'Start a new conversation to get going.'}
                </p>
              </div>

              {/* Quick stats cards */}
              {userStats && (
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">{userStats.conversationCount}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Conversations</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">{userStats.messageCount}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Messages</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">{formatNumber(userStats.totalTokensUsed)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Tokens used</div>
                  </div>
                </div>
              )}

              {/* New conversation CTA */}
              <button
                onClick={startNewConversation}
                className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mb-8"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start new conversation
              </button>

              {/* Recent conversations */}
              {userStats && userStats.recentConversations && userStats.recentConversations.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Recent conversations</h2>
                  <div className="space-y-1">
                    {userStats.recentConversations.map((convo) => (
                      <button
                        key={convo.id}
                        onClick={() => loadConversation(convo.id)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            <span className="text-sm text-slate-900 truncate font-medium">{convo.title}</span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                            <span className="text-[11px] text-slate-400">{convo.messageCount} msgs</span>
                            <span className="text-[11px] text-slate-400">{timeAgo(convo.updated_at)}</span>
                            <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Model info */}
              {userStats && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span>Model: {userStats.model}</span>
                    </div>
                    <span>Platform: {formatNumber(platformStats.totalMessages)} total messages</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConvoModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">New conversation</h2>
              <p className="text-sm text-slate-500 mt-1">Give it a name to help you find it later.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={newConvoTitle}
                  onChange={(e) => setNewConvoTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newConvoTitle.trim()) {
                      createConversationWithTitle()
                    }
                  }}
                  placeholder="e.g., Python help, Project ideas..."
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={createConversationWithTitle}
                  disabled={!newConvoTitle.trim()}
                  className="flex-1 bg-slate-900 text-white py-2.5 px-4 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewConvoModal(false)
                    setNewConvoTitle('')
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-lg hover:bg-slate-200 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

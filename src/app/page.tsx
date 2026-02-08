'use client'

import { useState, useRef, useEffect } from 'react'
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
          })
          await loadConversations(session.user.id)
        }
      } catch (error) {
        console.error('Session check error:', error)
      }
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { event, session: session ? 'Session exists' : 'No session' })
        
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          console.log('Auth event:', event)
        }
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
          })
          await loadConversations(session.user.id)
        } else {
          setUser(null)
          setConversations([])
          setCurrentConversation(null)
          setMessages([])
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

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

  // ==================== LANDING PAGE (NOT LOGGED IN) ====================
  if (!user) {
    return (
      <div className="min-h-screen mesh-gradient relative">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shadow-glow">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  ChatBot<span className="gradient-text">Pro</span>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => { setShowAuth(true); setAuthMode('signin') }}
                  className="text-sm font-medium text-slate-600 hover:text-primary-600 px-4 py-2 rounded-xl hover:bg-primary-50/50 transition-all duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setShowAuth(true); setAuthMode('signup') }}
                  className="gradient-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        {!showAuth ? (
          <div>
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-20 relative">
              {/* Decorative floating elements */}
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
              <div className="absolute top-40 right-10 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>
              <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-400/8 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>

              <div className="text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-primary-100 shadow-sm animate-fade-in">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-slate-700">Powered by Advanced AI Models</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight animate-slide-up">
                  Your Intelligent
                  <br />
                  <span className="gradient-text-hero">AI Assistant</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-1">
                  Experience seamless conversations powered by cutting-edge AI. 
                  Get instant answers, creative solutions, and intelligent assistance 
                  tailored to your needs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-fade-in-delay-2">
                  <button
                    onClick={() => { setShowAuth(true); setAuthMode('signup') }}
                    className="gradient-bg text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2"
                  >
                    Start Free Trial
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="flex -space-x-2">
                      {['bg-primary-400', 'bg-accent-400', 'bg-pink-400'].map((bg, i) => (
                        <div key={i} className={`w-8 h-8 ${bg} rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-xs`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-medium">Join 10,000+ professionals</span>
                  </div>
                </div>

                {/* Chat Preview */}
                <div className="max-w-2xl mx-auto animate-fade-in-delay-3">
                  <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-elevated border border-white/50 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-slate-400 ml-2 font-medium">ChatBot Pro</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="chat-bubble-user text-white px-5 py-3 max-w-[80%]">
                          <p className="text-sm">Can you help me write a Python script to analyze data?</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="chat-bubble-ai px-5 py-3 max-w-[85%]">
                          <p className="text-sm text-slate-700">Of course! I&apos;d be happy to help. Here&apos;s a clean data analysis script using pandas...</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-400 border border-slate-100">
                        Type your message...
                      </div>
                      <div className="gradient-bg rounded-xl px-4 py-3 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Everything you need to <span className="gradient-text">work smarter</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Powerful features designed to enhance your productivity and streamline your workflow.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    ),
                    title: 'Lightning Fast',
                    description: 'Get instant responses powered by cutting-edge AI technology with enterprise-grade performance.',
                    color: 'from-primary-500 to-primary-600',
                    bgColor: 'bg-primary-50',
                    iconColor: 'text-primary-600',
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    ),
                    title: 'Enterprise Security',
                    description: 'Your conversations are encrypted and stored securely with SOC 2 compliance and advanced privacy controls.',
                    color: 'from-accent-500 to-accent-600',
                    bgColor: 'bg-accent-50',
                    iconColor: 'text-accent-600',
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    ),
                    title: 'Smart Memory',
                    description: 'Access your conversation history with intelligent context awareness and seamless synchronization.',
                    color: 'from-pink-500 to-pink-600',
                    bgColor: 'bg-pink-50',
                    iconColor: 'text-pink-600',
                  },
                ].map((feature, i) => (
                  <div key={i} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-card card-hover">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <svg className={`w-6 h-6 ${feature.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {feature.icon}
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="gradient-bg rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Trusted by Leading Organizations
                  </h2>
                  <p className="text-lg text-primary-100 mb-12 max-w-2xl mx-auto">
                    Join thousands of professionals who rely on our AI assistant for their daily workflows
                  </p>
                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {[
                      { value: '10,000+', label: 'Active Users' },
                      { value: '1M+', label: 'Messages Processed' },
                      { value: '99.9%', label: 'Uptime SLA' },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                        <div className="text-primary-200 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { setShowAuth(true); setAuthMode('signup') }}
                    className="bg-white text-primary-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-primary-50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg"
                  >
                    Start Free Trial
                  </button>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        ) : (
          /* ==================== AUTH MODAL ==================== */
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-slide-up">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-8">
                <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-glow">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {authMode === 'signin' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm">
                  {authMode === 'signin' ? 'Sign in to continue your conversations' : 'Start your free trial today'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={authData.name}
                      onChange={(e) => setAuthData({...authData, name: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={authData.email}
                    onChange={(e) => setAuthData({...authData, email: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                    placeholder="you@company.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={authData.password}
                    onChange={(e) => setAuthData({...authData, password: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-bg text-white py-3.5 px-4 rounded-xl hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Please wait...
                    </span>
                  ) : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                </button>

                <div className="text-center pt-3">
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    {authMode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ==================== CHAT INTERFACE (LOGGED IN) ====================
  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-slate-200/80 flex flex-col h-full fixed left-0 top-0 transition-all duration-300 overflow-hidden z-30`}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shadow-glow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Chat<span className="gradient-text">Bot</span>
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
              title="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* New Conversation Button */}
        <div className="p-4">
          <button
            onClick={startNewConversation}
            className="w-full gradient-bg text-white py-3 px-4 rounded-xl hover:shadow-glow transition-all duration-300 font-medium flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Conversation
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-widest px-1">Recent</h3>
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative w-full text-left p-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  currentConversation?.id === conversation.id
                    ? 'bg-primary-50 border border-primary-200/50'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <button
                  onClick={() => loadConversation(conversation.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      currentConversation?.id === conversation.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-slate-900 truncate">{conversation.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(conversation.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={(e) => deleteConversation(conversation.id, e)}
                  className="absolute top-2.5 right-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg hover:bg-red-50"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white h-full overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!sidebarOpen && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all mr-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{currentConversation.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {messages.length} messages &middot; {new Date(currentConversation.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700 font-medium">Online</span>
                  </div>
                  <button
                    onClick={() => deleteConversation(currentConversation.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Delete conversation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 min-h-0 gradient-bg-subtle">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold ${
                      message.role === 'user' 
                        ? 'gradient-bg text-white shadow-glow' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {message.role === 'user' ? user.name.charAt(0).toUpperCase() : 'AI'}
                    </div>
                    
                    {/* Message Bubble */}
                    <div
                      className={`px-5 py-3.5 ${
                        message.role === 'user'
                          ? 'chat-bubble-user text-white'
                          : 'chat-bubble-ai text-slate-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-end gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold">
                      AI
                    </div>
                    <div className="chat-bubble-ai px-5 py-4">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 p-4 md:p-6 bg-white flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-slate-200 rounded-xl px-5 py-3.5 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="gradient-bg text-white px-6 py-3.5 rounded-xl hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Send</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center gradient-bg-subtle">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80 transition-all z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <div className="text-center max-w-md animate-fade-in">
              <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-float">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Start a Conversation</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Begin chatting with your AI assistant. Ask questions, get help with tasks, 
                or simply have a conversation.
              </p>
              <button
                onClick={startNewConversation}
                className="gradient-bg text-white py-3.5 px-8 rounded-xl hover:shadow-glow transition-all duration-300 font-semibold hover:scale-[1.03] active:scale-[0.98]"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConvoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-glow">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">New Conversation</h2>
              <p className="text-slate-500 text-sm">Give your conversation a meaningful title</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={newConvoTitle}
                  onChange={(e) => setNewConvoTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newConvoTitle.trim()) {
                      createConversationWithTitle()
                    }
                  }}
                  placeholder="e.g., Project Planning, Code Review..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={createConversationWithTitle}
                  disabled={!newConvoTitle.trim()}
                  className="flex-1 gradient-bg text-white py-3 px-4 rounded-xl hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all duration-300"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewConvoModal(false)
                    setNewConvoTitle('')
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 font-medium transition-all duration-200"
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

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Check if Supabase is properly configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Authentication will not work.')
      return
    }

    // Check for existing session
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { event, session })
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
      // Use Supabase client directly instead of API route
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
          // Create user profile and settings
          try {
            await supabase.from('users').insert({
              id: data.user.id,
              email: data.user.email,
              name: authData.name || authData.email.split('@')[0]
            })

            await supabase.from('user_settings').insert({
              user_id: data.user.id,
              model: 'meta-llama/Llama-3.2-3B-Instruct',
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
          alert(error.message)
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
        // State will be automatically updated by the auth listener
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !user) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      // Create conversation if none exists
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
        // Try to get error message from response
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
      
      // Check if response has an error
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
          content: `❌ Error: ${errorMessage}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  ChatBot Pro
                </span>
              </div>
              <button
                onClick={() => setShowAuth(true)}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {!showAuth ? (
          <div>
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
              <div className="text-center">
                <div className="inline-flex items-center bg-gray-50 rounded-full px-4 py-2 mb-8">
                  <span className="text-sm font-medium text-gray-600">New: Advanced AI Models Available</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Intelligent AI Assistant
                  <br />
                  <span className="text-gray-600">for Modern Teams</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Experience seamless conversations powered by advanced AI. 
                  Get instant answers, creative solutions, and intelligent assistance 
                  tailored to your needs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                  <button
                    onClick={() => { setShowAuth(true); setAuthMode('signup') }}
                    className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Start Free Trial
                  </button>
                  
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-gray-600 font-medium text-sm">A</div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-gray-600 font-medium text-sm">B</div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-gray-600 font-medium text-sm">C</div>
                    </div>
                    <span className="text-sm">Join 10,000+ professionals</span>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="mt-24 grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Lightning Fast</h3>
                  <p className="text-gray-600 leading-relaxed">Get instant responses powered by cutting-edge AI technology with enterprise-grade performance.</p>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Enterprise Security</h3>
                  <p className="text-gray-600 leading-relaxed">Your conversations are encrypted and stored securely with SOC 2 compliance and advanced privacy controls.</p>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Memory</h3>
                  <p className="text-gray-600 leading-relaxed">Access your conversation history with intelligent context awareness and seamless cross-device synchronization.</p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-24 bg-gray-50 rounded-2xl p-16 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Trusted by Leading Organizations
                </h2>
                <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                  Join thousands of professionals who rely on our AI assistant for their daily workflows
                </p>
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">1M+</div>
                    <div className="text-gray-600">Messages Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                    <div className="text-gray-600">Uptime SLA</div>
                  </div>
                </div>
                <button
                  onClick={() => { setShowAuth(true); setAuthMode('signup') }}
                  className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Footer */}
            <Footer/>
            </div>
          ) : (
          // Auth Modal
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600 mt-2 text-sm">
                  {authMode === 'signin' ? 'Sign in to continue' : 'Start your free trial'}
                </p>
              </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="you@company.com"
                  required
                />
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="••••••••"
                  required
                />
              </div>

              {authMode === 'signup' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={authData.name}
                    onChange={(e) => setAuthData({...authData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="John Doe"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                >
                  {isLoading ? 'Please wait...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                </button>

                <div className="text-center pt-4">
                <button
                  type="button"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
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

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">ChatBot Pro</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Sign Out
            </button>
          </div>
          <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
        </div>

        <div className="p-6 border-b border-gray-200">
          <button
            onClick={startNewConversation}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            + New Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Recent Conversations</h3>
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => loadConversation(conversation.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  currentConversation?.id === conversation.id
                    ? 'bg-white border-gray-300 shadow-sm'
                    : 'bg-transparent border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="font-medium text-sm text-gray-900 truncate mb-1">{conversation.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(conversation.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentConversation.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {messages.length} messages • {new Date(currentConversation.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-500">AI Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      message.role === 'user' 
                        ? 'bg-gray-900 text-white ml-3' 
                        : 'bg-gray-100 text-gray-600 mr-3'
                    }`}>
                      {message.role === 'user' ? user.name.charAt(0).toUpperCase() : 'AI'}
                    </div>
                    
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 mr-3 flex items-center justify-center text-xs font-medium">
                      AI
                    </div>
                    <div className="bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gray-400">AI</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Start a Conversation</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Begin chatting with your AI assistant. Ask questions, get help with tasks, 
                or simply have a conversation.
              </p>
              <button
                onClick={startNewConversation}
                className="bg-gray-900 text-white py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors duration-200 font-medium"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConvoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-gray-600">💬</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">New Conversation</h2>
              <p className="text-gray-600 text-sm">Give your conversation a meaningful title</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conversation Title</label>
                <input
                  type="text"
                  value={newConvoTitle}
                  onChange={(e) => setNewConvoTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newConvoTitle.trim()) {
                      createConversationWithTitle()
                    }
                  }}
                  placeholder="e.g., Project Planning, Code Review, Meeting Notes..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={createConversationWithTitle}
                  disabled={!newConvoTitle.trim()}
                  className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                >
                  Create Conversation
                </button>
                <button
                  onClick={() => {
                    setShowNewConvoModal(false)
                    setNewConvoTitle('')
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 font-medium transition-colors duration-200"
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
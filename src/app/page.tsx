'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Footer from '@/components/Footer'
import Logo from '@/components/Logo'
import Modal from '@/components/Modal'
import Toast, { type ToastMessage } from '@/components/Toast'
import ChatMessage, { TypingIndicator } from '@/components/ChatMessage'
import Composer from '@/components/Composer'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
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

const SUGGESTED_PROMPTS = [
  'Explain a concept in simple terms',
  'Help me debug a function',
  'Draft an email to my team',
  'Summarise this idea into 3 bullets',
]

const CONVERSATION_ICON = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
  />
)

const TRASH_ICON = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  />
)

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
  const [authError, setAuthError] = useState('')
  const [showNewConvoModal, setShowNewConvoModal] = useState(false)
  const [newConvoTitle, setNewConvoTitle] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalConversations: 0,
    totalMessages: 0,
  })
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [statsLoaded, setStatsLoaded] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const notify = useCallback((text: string, variant: 'error' | 'success' = 'error') => {
    setToast({ id: Date.now(), text, variant })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Start collapsed on small screens so the chat isn't hidden behind the drawer
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false)
  }, [])

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
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Authentication will not work.')
      return
    }

    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
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
    })

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

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setAuthError('')
    setShowAuth(true)
  }

  const closeAuth = () => {
    setShowAuth(false)
    setAuthError('')
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setIsLoading(true)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        setAuthError('Supabase is not configured. Add your credentials to .env.local to continue.')
        return
      }

      if (!authData.email || !authData.password) {
        setAuthError('Please enter both email and password.')
        return
      }

      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,
          options: {
            emailRedirectTo: undefined,
            data: {
              name: authData.name || authData.email.split('@')[0],
            },
          },
        })

        if (error) {
          setAuthError(error.message)
          return
        }

        if (data.user) {
          try {
            await supabase.from('users').insert({
              id: data.user.id,
              email: data.user.email,
              name: authData.name || authData.email.split('@')[0],
            })

            await supabase.from('user_settings').insert({
              user_id: data.user.id,
              model: 'llama-3.1-8b-instant',
              temperature: 0.7,
              max_tokens: 1000,
              system_prompt: 'You are a helpful, friendly AI assistant.',
            })
          } catch (dbError) {
            console.error('Database error:', dbError)
          }

          setShowAuth(false)
          setAuthData({ email: '', password: '', name: '' })

          if (!data.session) {
            notify('Account created. Check your email to confirm it before signing in.', 'success')
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password,
        })

        if (error) {
          console.error('Sign in error details:', {
            message: error.message,
            status: error.status,
            name: error.name,
          })

          let errorMessage = error.message
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please check your credentials and try again.'
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and confirm your account before signing in.'
          } else if (error.message.includes('User not found')) {
            errorMessage = 'No account found with this email. Please sign up first.'
          }

          setAuthError(errorMessage)
          return
        }

        if (data.user) {
          setShowAuth(false)
          setAuthData({ email: '', password: '', name: '' })
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setAuthError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        notify('Failed to sign out. Please try again.')
      } else {
        setUser(null)
        setConversations([])
        setCurrentConversation(null)
        setMessages([])
        setUserStats(null)
      }
    } catch (error) {
      console.error('Sign out error:', error)
      notify('Failed to sign out. Please try again.')
    }
  }

  const startNewConversation = () => {
    if (!user) return
    setShowNewConvoModal(true)
  }

  const createConversationWithTitle = async () => {
    if (!user || !newConvoTitle.trim()) return

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: newConvoTitle.trim(),
        }),
      })

      const data = await response.json()
      if (data.conversation) {
        setCurrentConversation(data.conversation)
        setMessages([])
        await loadConversations(user.id)
        fetchStats(user.id)
        setShowNewConvoModal(false)
        setNewConvoTitle('')
        if (window.innerWidth < 768) setSidebarOpen(false)
      } else if (data.error) {
        notify(data.error)
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
      notify('Failed to create conversation. Please try again.')
    }
  }

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      const data = await response.json()
      if (data.conversation) {
        setCurrentConversation(data.conversation)
        setMessages(data.conversation.messages || [])
        if (window.innerWidth < 768) setSidebarOpen(false)
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
      notify('Failed to open that conversation.')
    }
  }

  const deleteConversation = async () => {
    const conversationId = pendingDeleteId
    if (!conversationId) return

    setPendingDeleteId(null)

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
      notify('Failed to delete conversation. Please try again.')
    }
  }

  const handleSubmit = async () => {
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
            title: input.trim().substring(0, 50),
          }),
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
          userId: user.id,
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
          // Response wasn't JSON — keep the status-based message
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      fetchStats(user.id)
    } catch (error) {
      console.error('Error:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.'
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage, isError: true }])
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
  }

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(date).toLocaleDateString()
  }

  const authModal = (
    <Modal
      open={showAuth}
      onClose={closeAuth}
      title={authMode === 'signin' ? 'Welcome back' : 'Create your account'}
      description={authMode === 'signin' ? 'Sign in to continue where you left off.' : 'Get started for free — no card needed.'}
      showCloseButton
    >
      <form onSubmit={handleAuth} className="space-y-3.5">
        {authError && (
          <div className="animate-fade-in flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-red-700">{authError}</p>
          </div>
        )}

        {authMode === 'signup' && (
          <div>
            <label className="label" htmlFor="auth-name">
              Name
            </label>
            <input
              id="auth-name"
              type="text"
              value={authData.name}
              onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
              className="input"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
        )}

        <div>
          <label className="label" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            value={authData.email}
            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            className="input"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            value={authData.password}
            onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            className="input"
            placeholder="••••••••"
            autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Please wait…
            </>
          ) : authMode === 'signin' ? (
            'Sign in'
          ) : (
            'Create account'
          )}
        </button>

        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
              setAuthError('')
            }}
            className="rounded text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            {authMode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </Modal>
  )

  // ==================== LANDING PAGE (NOT LOGGED IN) ====================
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/85 backdrop-blur-xl">
          <div className="container-page">
            <div className="flex h-16 items-center justify-between">
              <Logo />
              <div className="flex items-center gap-1.5">
                <button onClick={() => openAuth('signin')} className="btn btn-sm btn-ghost">
                  Log in
                </button>
                <button onClick={() => openAuth('signup')} className="btn btn-sm btn-primary">
                  Sign up free
                </button>
              </div>
            </div>
          </div>
        </nav>

        {authModal}
        <Toast toast={toast} onDismiss={dismissToast} />

        {/* Hero */}
        <section className="container-page pb-16 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            {platformStats.totalUsers > 0 && (
              <div className="badge badge-success mb-6">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {formatNumber(platformStats.totalUsers)} users already on the platform
              </div>
            )}

            <h1 className="text-balance mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-6xl">
              AI conversations
              <br />
              <span className="text-slate-400">that actually help</span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-500">
              A clean, fast AI chat assistant powered by Groq. Have real conversations, save your history, and get
              intelligent responses instantly.
            </p>

            <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={() => openAuth('signup')} className="btn btn-primary px-6 py-3">
                Get started for free
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button onClick={() => openAuth('signin')} className="btn btn-ghost px-6 py-3">
                I already have an account
              </button>
            </div>

            <p className="text-xs text-slate-400">No credit card required. Free to use.</p>
          </div>

          {/* Chat preview */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-card">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                </div>
                <span className="ml-2 text-xs text-slate-400">ChatBot Pro</span>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex justify-end">
                  <div className="bubble bubble-user max-w-[75%]">
                    Help me write a Python function to parse CSV files efficiently
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bubble bubble-ai max-w-[85%]">
                    Here&apos;s an efficient CSV parser using Python&apos;s built-in{' '}
                    <code className="rounded bg-slate-200/70 px-1.5 py-0.5 text-xs">csv</code> module with type hints
                    and error handling:
                    <div className="mt-2 rounded-lg border border-slate-100 bg-white p-3 font-mono text-xs text-slate-600">
                      <div>
                        <span className="text-blue-600">import</span> csv
                      </div>
                      <div>
                        <span className="text-blue-600">from</span> pathlib{' '}
                        <span className="text-blue-600">import</span> Path
                      </div>
                      <div className="mt-1">
                        <span className="text-blue-600">def</span>{' '}
                        <span className="text-amber-600">parse_csv</span>(filepath: str):
                      </div>
                      <div className="pl-4 text-slate-400">…</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bubble bubble-user max-w-[75%]">
                    Can you add memory-efficient streaming for large files?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bubble bubble-ai max-w-[85%]">
                    Absolutely! Here&apos;s a generator-based approach that uses{' '}
                    <code className="rounded bg-slate-200/70 px-1.5 py-0.5 text-xs">yield</code> to stream rows without
                    loading the entire file into memory…
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                  <span className="flex-1 text-sm text-slate-400">Ask anything…</span>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live stats */}
        <section className="border-y border-slate-100 bg-slate-50/60">
          <div className="container-page py-12">
            <p className="eyebrow mb-8 text-center">Live platform data</p>
            <div className="mx-auto grid max-w-lg grid-cols-3 gap-8">
              {[
                {
                  value: formatNumber(platformStats.totalUsers),
                  label: 'Registered users',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-1.053M18 10.5a3 3 0 11-6 0 3 3 0 016 0zm-9-3a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  ),
                },
                {
                  value: formatNumber(platformStats.totalConversations),
                  label: 'Conversations',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  ),
                },
                {
                  value: formatNumber(platformStats.totalMessages),
                  label: 'Messages sent',
                  icon: CONVERSATION_ICON,
                },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <svg className="mx-auto mb-2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {stat.icon}
                  </svg>
                  <div className="text-2xl font-bold tabular-nums text-slate-900">
                    {statsLoaded ? stat.value : '—'}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container-page py-20">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Built for real conversations
            </h2>
            <p className="mx-auto max-w-lg text-slate-500">
              Everything you need to have productive AI conversations, nothing you don&apos;t.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Powered by Groq',
                description:
                  "Ultra-fast inference with Groq's LPU technology. Get responses in milliseconds, not seconds.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                ),
              },
              {
                title: 'Persistent history',
                description:
                  'Every conversation is saved to your account. Pick up right where you left off, on any device.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
              {
                title: 'Secure by default',
                description:
                  'Your data is encrypted and stored with Supabase. Row-level security ensures only you see your chats.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                ),
              },
            ].map((feature) => (
              <div key={feature.title} className="card-interactive group p-6">
                <div className="icon-tile mb-4 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-slate-100 bg-slate-50/60">
          <div className="container-page py-20">
            <div className="mb-14 text-center">
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Get started in 30 seconds
              </h2>
              <p className="text-slate-500">No complex setup. Just sign up and start chatting.</p>
            </div>
            <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
              {[
                { step: '01', title: 'Create an account', description: 'Sign up with your email. Takes less than 10 seconds.' },
                { step: '02', title: 'Start a conversation', description: 'Create a new conversation and ask your first question.' },
                { step: '03', title: 'Get instant answers', description: 'Get AI-powered responses with your full conversation history saved.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mb-3 text-4xl font-bold text-slate-200">{item.step}</div>
                  <h3 className="mb-2 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-page py-20">
          <div className="rounded-2xl bg-slate-900 px-8 py-14 text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-white md:text-3xl">Ready to start?</h2>
            <p className="mx-auto mb-8 max-w-md text-slate-400">
              Join {platformStats.totalUsers > 0 ? formatNumber(platformStats.totalUsers) + ' users' : 'others'} already
              having smarter conversations.
            </p>
            <button onClick={() => openAuth('signup')} className="btn btn-invert px-6 py-3">
              Create free account
            </button>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  // ==================== CHAT INTERFACE (LOGGED IN) ====================
  const sidebarToggle = (
    <button
      onClick={() => setSidebarOpen(true)}
      className={`icon-btn ${sidebarOpen ? 'md:hidden' : ''}`}
      aria-label="Open sidebar"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="animate-fade-in fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-slate-50 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <Logo size="sm" />
            <button onClick={() => setSidebarOpen(false)} className="icon-btn p-1" aria-label="Close sidebar">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
            <div className="avatar bg-slate-900 text-white">{user.name.charAt(0).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
            <button onClick={handleSignOut} className="icon-btn icon-btn-danger p-1" title="Sign out" aria-label="Sign out">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-3">
          <button onClick={startNewConversation} className="btn btn-primary w-full py-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New conversation
          </button>
        </div>

        <div className="scrollbar-subtle flex-1 overflow-y-auto px-3 pb-3">
          <p className="eyebrow mb-2 px-2 text-[11px]">History</p>
          <div className="space-y-0.5">
            {conversations.map((conversation) => {
              const active = currentConversation?.id === conversation.id
              return (
                <div
                  key={conversation.id}
                  className={`group relative rounded-lg transition-colors ${
                    active ? 'border border-slate-200 bg-white shadow-card' : 'border border-transparent hover:bg-white/70'
                  }`}
                >
                  <button onClick={() => loadConversation(conversation.id)} className="w-full px-2.5 py-2 text-left">
                    <div className="flex items-center gap-2.5">
                      <svg
                        className={`h-3.5 w-3.5 flex-shrink-0 ${active ? 'text-slate-900' : 'text-slate-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        {CONVERSATION_ICON}
                      </svg>
                      <div className="min-w-0 flex-1 pr-5">
                        <div className="truncate text-sm font-medium text-slate-900">{conversation.title}</div>
                        <div className="mt-0.5 text-[11px] text-slate-400">{timeAgo(conversation.updated_at)}</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setPendingDeleteId(conversation.id)}
                    className="icon-btn icon-btn-danger absolute right-1 top-1.5 p-1 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                    title="Delete conversation"
                    aria-label={`Delete ${conversation.title}`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {TRASH_ICON}
                    </svg>
                  </button>
                </div>
              )
            })}
            {conversations.length === 0 && (
              <div className="px-2 py-8 text-center">
                <p className="text-xs text-slate-400">No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {userStats && (
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{userStats.conversationCount} chats</span>
              <span>{userStats.messageCount} messages</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main area */}
      <div
        className={`flex min-w-0 flex-1 flex-col transition-[padding] duration-200 ${sidebarOpen ? 'md:pl-72' : 'pl-0'}`}
      >
        {currentConversation ? (
          <>
            <header className="flex-shrink-0 border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-5">
              <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  {sidebarToggle}
                  <div className="min-w-0">
                    <h1 className="truncate text-sm font-semibold text-slate-900">{currentConversation.title}</h1>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {messages.length} {messages.length === 1 ? 'message' : 'messages'} &middot;{' '}
                      {timeAgo(currentConversation.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  <div className="badge badge-success hidden sm:inline-flex">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Online
                  </div>
                  <button
                    onClick={() => setPendingDeleteId(currentConversation.id)}
                    className="icon-btn icon-btn-danger"
                    title="Delete conversation"
                    aria-label="Delete conversation"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {TRASH_ICON}
                    </svg>
                  </button>
                </div>
              </div>
            </header>

            <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="mx-auto max-w-3xl space-y-5">
                {messages.length === 0 && !isLoading && (
                  <div className="animate-fade-in py-10 text-center">
                    <div className="icon-tile mx-auto mb-4 h-12 w-12">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {CONVERSATION_ICON}
                      </svg>
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">Start the conversation</h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                      Ask a question below, or pick one of these to get going.
                    </p>
                    <div className="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-2">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setInput(prompt)}
                          className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    isError={message.isError}
                    userInitial={user.name.charAt(0).toUpperCase()}
                  />
                ))}

                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-slate-100 bg-white px-4 py-3 sm:px-6">
              <div className="mx-auto max-w-3xl">
                <Composer
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  disabled={isLoading}
                  placeholder="Type your message…"
                />
              </div>
            </div>
          </>
        ) : (
          /* ==================== DASHBOARD ==================== */
          <>
            <header className="flex-shrink-0 border-b border-slate-100 px-4 py-3 sm:px-6">
              <div className="mx-auto flex max-w-2xl items-center gap-2">
                {sidebarToggle}
                <h1 className="text-sm font-semibold text-slate-900">Overview</h1>
              </div>
            </header>

            <div className="scrollbar-subtle flex-1 overflow-y-auto">
              <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
                <div className="mb-8">
                  <h2 className="mb-1 text-2xl font-bold tracking-tight text-slate-900">
                    Welcome back, {user.name.split(' ')[0]}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {userStats && userStats.conversationCount > 0
                      ? `You have ${userStats.conversationCount} conversation${
                          userStats.conversationCount === 1 ? '' : 's'
                        } and ${userStats.messageCount} messages.`
                      : 'Start a new conversation to get going.'}
                  </p>
                </div>

                {userStats && (
                  <div className="mb-8 grid grid-cols-3 gap-3">
                    {[
                      { value: userStats.conversationCount.toLocaleString(), label: 'Conversations' },
                      { value: userStats.messageCount.toLocaleString(), label: 'Messages' },
                      { value: formatNumber(userStats.totalTokensUsed), label: 'Tokens used' },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-2xl font-bold tabular-nums text-slate-900">{stat.value}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={startNewConversation} className="btn btn-primary mb-8 w-full rounded-xl py-3">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start new conversation
                </button>

                {userStats && userStats.recentConversations && userStats.recentConversations.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">Recent conversations</h3>
                    <div className="space-y-1">
                      {userStats.recentConversations.map((convo) => (
                        <button
                          key={convo.id}
                          onClick={() => loadConversation(convo.id)}
                          className="group w-full rounded-lg border border-transparent px-4 py-3 text-left transition-colors hover:border-slate-100 hover:bg-slate-50"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <svg className="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                {CONVERSATION_ICON}
                              </svg>
                              <span className="truncate text-sm font-medium text-slate-900">{convo.title}</span>
                            </div>
                            <div className="flex flex-shrink-0 items-center gap-3">
                              <span className="hidden text-[11px] text-slate-400 sm:inline">
                                {convo.messageCount} msgs
                              </span>
                              <span className="text-[11px] text-slate-400">{timeAgo(convo.updated_at)}</span>
                              <svg
                                className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover:text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {userStats && (
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Model: {userStats.model}</span>
                    </div>
                    <span>Platform: {formatNumber(platformStats.totalMessages)} total messages</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* New conversation modal */}
      <Modal
        open={showNewConvoModal}
        onClose={() => {
          setShowNewConvoModal(false)
          setNewConvoTitle('')
        }}
        title="New conversation"
        description="Give it a name to help you find it later."
      >
        <div className="space-y-3">
          <input
            type="text"
            value={newConvoTitle}
            onChange={(e) => setNewConvoTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newConvoTitle.trim()) {
                createConversationWithTitle()
              }
            }}
            placeholder="e.g. Python help, Project ideas…"
            className="input"
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={createConversationWithTitle} disabled={!newConvoTitle.trim()} className="btn btn-primary flex-1">
              Create
            </button>
            <button
              onClick={() => {
                setShowNewConvoModal(false)
                setNewConvoTitle('')
              }}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        title="Delete conversation?"
        description="This permanently removes the conversation and all of its messages. This can't be undone."
      >
        <div className="flex gap-2">
          <button
            onClick={deleteConversation}
            className="btn flex-1 bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
          <button onClick={() => setPendingDeleteId(null)} className="btn btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </Modal>

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}

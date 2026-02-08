'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm the demo chatbot. This version works without any external APIs — perfect for testing! Try saying hello.",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Sorry, I encountered an error.'}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen mesh-gradient flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Demo <span className="gradient-text">Chatbot</span>
              </h1>
              <p className="text-xs text-slate-500">No API keys required</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-700 font-medium">Demo Mode</span>
            </div>
            <Link
              href="/"
              className="gradient-bg text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
            >
              Full Version
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-elevated h-[600px] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 gradient-bg rounded-xl flex items-center justify-center text-white text-xs font-semibold">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Demo Assistant</p>
              <p className="text-xs text-slate-400">Always online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 gradient-bg-subtle">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold ${
                    message.role === 'user'
                      ? 'gradient-bg text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {message.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div
                    className={`px-4 py-3 ${
                      message.role === 'user'
                        ? 'chat-bubble-user text-white'
                        : 'chat-bubble-ai text-slate-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-end gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold">
                    AI
                  </div>
                  <div className="chat-bubble-ai px-4 py-3">
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

          {/* Input Form */}
          <div className="border-t border-slate-100 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="gradient-bg text-white px-5 py-3 rounded-xl hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="glass border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-xs text-slate-500 text-center">
            Demo Mode — No external APIs required. Try: &quot;Hello&quot;, &quot;How are you?&quot;, &quot;What&apos;s your name?&quot;
          </p>
        </div>
      </footer>
    </div>
  )
}

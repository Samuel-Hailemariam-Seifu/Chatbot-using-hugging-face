'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { LogoMark } from '@/components/Logo'
import ChatMessage, { TypingIndicator } from '@/components/ChatMessage'
import Composer from '@/components/Composer'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
}

const SUGGESTIONS = ['Hello', 'How are you?', 'What can you do?']

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm the demo chatbot. This works without any external APIs — perfect for testing. Try saying hello!",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Something went wrong.',
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <header className="flex-shrink-0 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <LogoMark />
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-slate-900">Demo chatbot</h1>
              <p className="text-[11px] text-slate-400">No API keys required</p>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <span className="badge badge-warning hidden sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Demo mode
            </span>
            <Link href="/" className="btn btn-sm btn-primary">
              Full version
            </Link>
          </div>
        </div>
      </header>

      <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-5">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              isError={message.isError}
              userInitial="U"
            />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-slate-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-3xl">
          {messages.length <= 1 && (
            <div className="mb-3 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  disabled={isLoading}
                  className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <Composer
            value={input}
            onChange={setInput}
            onSubmit={() => sendMessage(input)}
            disabled={isLoading}
            placeholder="Type your message…"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

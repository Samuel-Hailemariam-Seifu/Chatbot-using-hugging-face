'use client'

import React, { useState } from 'react'

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="avatar bg-slate-100 text-slate-600">AI</div>
      <div className="bubble-ai flex items-center gap-1.5 px-4 py-3.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  /** Initial shown in the user avatar */
  userInitial?: string
  isError?: boolean
}

export default function ChatMessage({ role, content, userInitial = 'U', isError = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = role === 'user'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable (insecure context or denied permission) — nothing to show.
    }
  }

  return (
    <div className={`group flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] items-start gap-2.5 sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`avatar ${isUser ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
          {isUser ? userInitial : 'AI'}
        </div>

        <div className={`flex min-w-0 flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`bubble ${isUser ? 'bubble-user' : isError ? 'bubble-error' : 'bubble-ai'}`}>
            <p className="whitespace-pre-wrap break-words">{content}</p>
          </div>

          {!isUser && !isError && (
            <button
              onClick={copy}
              className="rounded px-1 text-[11px] text-slate-400 opacity-0 transition-opacity hover:text-slate-600 focus-visible:opacity-100 group-hover:opacity-100"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

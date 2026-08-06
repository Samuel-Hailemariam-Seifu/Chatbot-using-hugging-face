'use client'

import React, { useEffect, useRef } from 'react'

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
}

const MAX_HEIGHT = 200

export default function Composer({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Ask anything…',
  autoFocus = false,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`
  }, [value])

  const canSend = value.trim().length > 0 && !disabled

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault()
    if (!canSend) return
    onSubmit()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 pl-3.5 transition-colors focus-within:border-slate-400 hover:border-slate-300">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className="no-focus-ring max-h-[200px] flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 disabled:text-slate-400"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-400">
        Press <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-sans">Enter</kbd> to send,{' '}
        <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-sans">Shift + Enter</kbd> for a new
        line
      </p>
    </form>
  )
}

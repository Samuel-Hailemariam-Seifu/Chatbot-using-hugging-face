'use client'

import React, { useEffect } from 'react'

export interface ToastMessage {
  id: number
  text: string
  variant: 'error' | 'success'
}

export default function Toast({ toast, onDismiss }: { toast: ToastMessage | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onDismiss, 4500)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  const isError = toast.variant === 'error'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className="animate-slide-up pointer-events-auto flex max-w-md items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-elevated"
      >
        <svg
          className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isError ? 'text-red-500' : 'text-emerald-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isError ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        <p className="text-sm text-slate-700">{toast.text}</p>
        <button onClick={onDismiss} className="icon-btn -mr-1.5 -mt-1 ml-1 p-1" aria-label="Dismiss notification">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

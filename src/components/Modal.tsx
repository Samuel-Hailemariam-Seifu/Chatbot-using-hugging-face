'use client'

import React, { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  /** Width utility for the panel, e.g. "max-w-sm" */
  size?: string
  showCloseButton?: boolean
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'max-w-sm',
  showCloseButton = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`animate-scale-in relative w-full rounded-2xl bg-white p-6 shadow-modal ${size}`}
      >
        {showCloseButton && (
          <button onClick={onClose} className="icon-btn absolute right-3.5 top-3.5" aria-label="Close dialog">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

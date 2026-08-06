import React from 'react'

const markSize = {
  sm: 'h-7 w-7 rounded-md',
  md: 'h-8 w-8 rounded-lg',
} as const

const iconSize = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
} as const

export function LogoMark({ size = 'md' }: { size?: keyof typeof markSize }) {
  return (
    <div className={`flex flex-shrink-0 items-center justify-center bg-slate-900 ${markSize[size]}`}>
      <svg className={`text-white ${iconSize[size]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </div>
  )
}

export default function Logo({
  size = 'md',
  className = '',
}: {
  size?: keyof typeof markSize
  className?: string
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span
        className={`font-semibold tracking-tight text-slate-900 ${size === 'sm' ? 'text-sm' : 'text-lg'}`}
      >
        ChatBot Pro
      </span>
    </span>
  )
}

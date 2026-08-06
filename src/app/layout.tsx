import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ChatBot Pro — AI Assistant for Modern Teams',
  description: 'Next-generation AI chatbot powered by advanced language models. Secure, fast, and intelligent conversations for modern teams.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-white font-sans text-slate-900 antialiased">{children}</body>
    </html>
  )
}

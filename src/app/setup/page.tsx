'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface EnvCheck {
  environment?: {
    NEXT_PUBLIC_SUPABASE_URL?: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
    GROQ_API_KEY?: string
  }
}

interface GroqCheck {
  status?: string
}

type StatusTone = 'ok' | 'warn' | 'fail'

function StatusPill({ tone, label }: { tone: StatusTone; label: string }) {
  const tones: Record<StatusTone, string> = {
    ok: 'badge-success',
    warn: 'badge-warning',
    fail: 'badge-danger',
  }

  const dots: Record<StatusTone, string> = {
    ok: 'bg-emerald-500',
    warn: 'bg-amber-500',
    fail: 'bg-red-500',
  }

  return (
    <span className={`badge ${tones[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />
      {label}
    </span>
  )
}

function CheckRow({ label, tone, status }: { label: string; tone: StatusTone; status: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0 last:pb-0">
      <span className="text-sm text-slate-600">{label}</span>
      <StatusPill tone={tone} label={status} />
    </div>
  )
}

export default function SetupPage() {
  const [envStatus, setEnvStatus] = useState<EnvCheck | null>(null)
  const [groqStatus, setGroqStatus] = useState<GroqCheck | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const envResponse = await fetch('/api/env-check')
        setEnvStatus(await envResponse.json())

        const groqResponse = await fetch('/api/test-groq')
        setGroqStatus(await groqResponse.json())
      } catch (error) {
        console.error('Setup check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSetup()
  }, [])

  const env = envStatus?.environment
  const isSupabaseConfigured = Boolean(
    env?.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  )

  const boolTone = (value: unknown): StatusTone => (value ? 'ok' : 'fail')

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="container-page pb-6 pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Setup status</h1>
            <p className="text-lg leading-relaxed text-slate-500">
              A quick health check of your environment variables and connected services.
            </p>
          </div>
        </section>

        <section className="container-page pb-20">
          <div className="mx-auto max-w-3xl">
            {loading ? (
              <div className="card flex flex-col items-center justify-center gap-3 py-20">
                <svg className="h-6 w-6 animate-spin text-slate-400" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-sm text-slate-500">Checking your setup…</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="card p-6">
                    <h2 className="mb-4 text-sm font-semibold text-slate-900">Environment variables</h2>
                    <CheckRow
                      label="Supabase URL"
                      tone={boolTone(env?.NEXT_PUBLIC_SUPABASE_URL)}
                      status={env?.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}
                    />
                    <CheckRow
                      label="Supabase anon key"
                      tone={boolTone(env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)}
                      status={env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
                    />
                    <CheckRow
                      label="Groq API key"
                      tone={boolTone(env?.GROQ_API_KEY)}
                      status={env?.GROQ_API_KEY ? 'Set' : 'Missing'}
                    />
                  </div>

                  <div className="card p-6">
                    <h2 className="mb-4 text-sm font-semibold text-slate-900">Service connectivity</h2>
                    <CheckRow
                      label="Groq API"
                      tone={groqStatus?.status === 'success' ? 'ok' : 'fail'}
                      status={groqStatus?.status === 'success' ? 'Working' : 'Failed'}
                    />
                    <CheckRow
                      label="Supabase"
                      tone={isSupabaseConfigured ? 'ok' : 'warn'}
                      status={isSupabaseConfigured ? 'Configured' : 'Not set up'}
                    />
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="mb-4 text-sm font-semibold text-slate-900">Next steps</h2>

                  {isSupabaseConfigured ? (
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                      <h3 className="mb-1 text-sm font-semibold text-emerald-800">Supabase is configured</h3>
                      <p className="text-sm text-emerald-700">
                        Everything is wired up. You can sign in and use the full chatbot with persistent history.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                      <h3 className="mb-1 text-sm font-semibold text-amber-900">Supabase setup required</h3>
                      <p className="mb-3 text-sm text-amber-800">
                        Authentication and saved conversations need a Supabase project.
                      </p>
                      <ol className="space-y-1.5 text-sm text-amber-800">
                        {[
                          <>
                            Create a project at{' '}
                            <a
                              href="https://supabase.com"
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium underline underline-offset-2"
                            >
                              supabase.com
                            </a>
                          </>,
                          'Copy your credentials from Settings → API',
                          'Add them to your .env.local file',
                          'Run the schema in supabase-schema.sql',
                        ].map((step, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200/70 text-[11px] font-semibold text-amber-900">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link href="/" className="btn btn-primary">
                      Go to chatbot
                    </Link>
                    <Link href="/demo" className="btn btn-secondary">
                      Try demo version
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

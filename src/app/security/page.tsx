import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Security() {
  const securityFeatures = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      ),
      title: 'End-to-End Encryption',
      description: 'All conversations are encrypted in transit and at rest using AES-256, ensuring your data remains private.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      ),
      title: 'Row-Level Security',
      description: 'Supabase RLS policies ensure each user can only access their own data. Full data isolation by design.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      ),
      title: 'Secure Authentication',
      description: 'Powered by Supabase Auth with JWT tokens, email verification, and secure password hashing.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      ),
      title: 'Audit Logging',
      description: 'All database operations are tracked. Conversation timestamps and analytics are stored for full visibility.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      ),
      title: 'Database Security',
      description: 'PostgreSQL with Supabase manages all data. Automatic backups, connection pooling, and encryption.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      ),
      title: 'Regular Updates',
      description: 'Dependencies and security patches are applied regularly. We stay current with the latest security practices.',
    },
  ]

  const certifications = [
    { label: 'SOC 2', name: 'SOC 2 Type II', description: 'Security and confidentiality controls' },
    { label: 'GDPR', name: 'GDPR Compliant', description: 'European data protection' },
    { label: 'ISO', name: 'ISO 27001', description: 'Information security management' },
    { label: 'CCPA', name: 'CCPA Ready', description: 'California privacy compliance' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="container-page pb-12 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Security you can trust
          </h1>
          <p className="text-lg leading-relaxed text-slate-500">
            Your data is encrypted, isolated, and protected by industry-standard security measures.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="container-page pb-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {securityFeatures.map((feature, i) => (
            <div key={i} className="card-interactive group p-6">
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

      {/* Compliance */}
      <section className="container-page pb-20">
        <div className="rounded-2xl bg-slate-900 px-8 py-12">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Compliance &amp; certifications
            </h2>
            <p className="text-sm text-slate-400">Meeting the highest standards for data protection</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                  <span className="text-sm font-bold text-white">{cert.label}</span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-white">{cert.name}</h3>
                <p className="text-xs text-slate-400">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="container-page pb-12 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">Get in touch</h1>
          <p className="text-lg leading-relaxed text-slate-500">
            Have questions? We&apos;re here to help. Reach out for support, sales, or partnerships.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="container-page mx-auto max-w-4xl pb-20">
        <div className="grid gap-6 md:grid-cols-5">
          {/* Form */}
          <div className="card p-6 md:col-span-3">
            <h2 className="mb-5 text-lg font-semibold tracking-tight text-slate-900">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label" htmlFor="contact-first-name">
                    First name
                  </label>
                  <input id="contact-first-name" type="text" className="input" placeholder="John" autoComplete="given-name" />
                </div>
                <div>
                  <label className="label" htmlFor="contact-last-name">
                    Last name
                  </label>
                  <input id="contact-last-name" type="text" className="input" placeholder="Doe" autoComplete="family-name" />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="contact-email">
                  Email
                </label>
                <input id="contact-email" type="email" className="input" placeholder="john@example.com" autoComplete="email" />
              </div>

              <div>
                <label className="label" htmlFor="contact-subject">
                  Subject
                </label>
                <select id="contact-subject" className="input">
                  <option>General inquiry</option>
                  <option>Sales question</option>
                  <option>Technical support</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="label" htmlFor="contact-message">
                  Message
                </label>
                <textarea id="contact-message" rows={4} className="input resize-none" placeholder="How can we help?" />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Send message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">Contact info</h2>
              <div className="space-y-5">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
                    title: 'Email',
                    lines: ['support@chatbotpro.com', 'sales@chatbotpro.com'],
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />,
                    title: 'Phone',
                    lines: ['+1 (555) 123-4567', 'Mon–Fri 9AM–6PM PST'],
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    ),
                    title: 'Office',
                    lines: ['123 Business Street', 'San Francisco, CA 94105'],
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="icon-tile h-9 w-9 flex-shrink-0">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <h3 className="mb-0.5 text-sm font-medium text-slate-900">{item.title}</h3>
                      {item.lines.map((line, j) => (
                        <p key={j} className="text-sm text-slate-500">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Response times</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'General inquiries', time: '24 hours' },
                  { label: 'Technical support', time: '4 hours' },
                  { label: 'Sales questions', time: '2 hours' },
                  { label: 'Enterprise support', time: '1 hour' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="badge badge-neutral">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

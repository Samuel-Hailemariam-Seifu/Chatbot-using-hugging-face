import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Contact() {
  return (
    <div className="min-h-screen mesh-gradient">
      <Header />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
        <div className="absolute top-10 left-20 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-accent-400/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-primary-100 shadow-sm">
            <span className="text-sm font-medium text-primary-600">We&apos;re here to help</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Have questions about ChatBot Pro? We&apos;re here to help. Reach out to our team for support, sales inquiries, or partnership opportunities.
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Form */}
          <div className="md:col-span-3 bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-card">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h2>
            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  placeholder="john@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  placeholder="Your Company"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900">
                  <option>General Inquiry</option>
                  <option>Sales Question</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea
                  rows={5}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus-ring bg-slate-50/50 text-slate-900 placeholder:text-slate-400 resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full gradient-bg text-white py-3.5 px-4 rounded-xl hover:shadow-glow font-semibold transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-card">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Info</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                    title: 'Email',
                    lines: ['support@chatbotpro.com', 'sales@chatbotpro.com'],
                    bgColor: 'bg-primary-50',
                    iconColor: 'text-primary-600',
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
                    title: 'Phone',
                    lines: ['+1 (555) 123-4567', 'Mon-Fri 9AM-6PM PST'],
                    bgColor: 'bg-accent-50',
                    iconColor: 'text-accent-600',
                  },
                  {
                    icon: (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    ),
                    title: 'Office',
                    lines: ['123 Business Street', 'San Francisco, CA 94105'],
                    bgColor: 'bg-pink-50',
                    iconColor: 'text-pink-600',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <svg className={`w-5 h-5 ${item.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.title}</h3>
                      {item.lines.map((line, j) => (
                        <p key={j} className="text-slate-600 text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-card">
              <h3 className="font-bold text-slate-900 mb-4">Response Times</h3>
              <div className="space-y-3">
                {[
                  { label: 'General inquiries', time: '24 hours' },
                  { label: 'Technical support', time: '4 hours' },
                  { label: 'Sales questions', time: '2 hours' },
                  { label: 'Enterprise support', time: '1 hour' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

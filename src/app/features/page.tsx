import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Features() {
  const features = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
      title: 'Lightning Fast',
      description: 'Get instant responses powered by cutting-edge AI technology with enterprise-grade performance and sub-second latency.',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      ),
      title: 'Enterprise Security',
      description: 'Your conversations are encrypted and stored securely with SOC 2 compliance and advanced privacy controls.',
      bgColor: 'bg-accent-50',
      iconColor: 'text-accent-600',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      ),
      title: 'Smart Memory',
      description: 'Access your conversation history with intelligent context awareness and seamless cross-device synchronization.',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      title: 'Advanced Analytics',
      description: 'Track usage patterns, conversation insights, and performance metrics with detailed analytics dashboard.',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
      title: 'Team Collaboration',
      description: 'Share conversations, collaborate on projects, and manage team access with advanced permission controls.',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      icon: (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      ),
      title: 'Custom Integrations',
      description: 'Connect with your favorite tools and services through our comprehensive API and webhook system.',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
  ]

  return (
    <div className="min-h-screen mesh-gradient">
      <Header />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 left-10 w-60 h-60 bg-accent-400/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-primary-100 shadow-sm">
            <span className="text-sm font-medium text-primary-600">Explore our capabilities</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            Powerful Features for
            <br />
            <span className="gradient-text">Modern Teams</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover the comprehensive set of features that make ChatBot Pro the perfect AI assistant for your organization.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-card card-hover">
              <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <svg className={`w-6 h-6 ${feature.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="gradient-bg rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Start your free trial and discover how ChatBot Pro can transform your workflow.
            </p>
            <a
              href="/"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-primary-50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

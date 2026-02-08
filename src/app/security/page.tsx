import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Security() {
  const securityFeatures = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      ),
      title: 'End-to-End Encryption',
      description: 'All conversations are encrypted in transit and at rest using AES-256 encryption, ensuring your data remains private and secure.',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      ),
      title: 'SOC 2 Compliance',
      description: 'We maintain SOC 2 Type II certification, demonstrating our commitment to security, availability, and confidentiality.',
      bgColor: 'bg-accent-50',
      iconColor: 'text-accent-600',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      ),
      title: 'Access Controls',
      description: 'Advanced role-based access controls ensure that only authorized personnel can access sensitive data and administrative functions.',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
      title: 'Audit Logging',
      description: 'Comprehensive audit logs track all system access and data modifications, providing complete visibility into system activity.',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      title: 'Data Residency',
      description: 'Choose your data residency region to ensure compliance with local data protection regulations and requirements.',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      ),
      title: 'Regular Security Updates',
      description: 'We continuously monitor and update our security measures to protect against emerging threats and vulnerabilities.',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
  ]

  const certifications = [
    { label: 'SOC 2', name: 'SOC 2 Type II', description: 'Security, availability, and confidentiality controls' },
    { label: 'GDPR', name: 'GDPR Compliant', description: 'European data protection regulation compliance' },
    { label: 'ISO', name: 'ISO 27001', description: 'Information security management system' },
    { label: 'CCPA', name: 'CCPA Ready', description: 'California Consumer Privacy Act compliance' },
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
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-slate-700">Enterprise-grade protection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            Security you can
            <br />
            <span className="gradient-text">trust completely</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your data security is our top priority. We implement industry-leading security measures to protect your conversations and information.
          </p>
        </div>
      </div>

      {/* Security Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, i) => (
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

      {/* Compliance Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="gradient-bg rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Compliance & Certifications</h2>
              <p className="text-lg text-primary-100 max-w-2xl mx-auto">We meet the highest standards for data protection and security</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, i) => (
                <div key={i} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-200">
                  <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-white">{cert.label}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{cert.name}</h3>
                  <p className="text-sm text-primary-200">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

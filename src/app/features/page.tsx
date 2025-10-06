import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Modern Teams
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover the comprehensive set of features that make ChatBot Pro the perfect AI assistant for your organization.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">Get instant responses powered by cutting-edge AI technology with enterprise-grade performance.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Enterprise Security</h3>
            <p className="text-gray-600 leading-relaxed">Your conversations are encrypted and stored securely with SOC 2 compliance and advanced privacy controls.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Memory</h3>
            <p className="text-gray-600 leading-relaxed">Access your conversation history with intelligent context awareness and seamless cross-device synchronization.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Advanced Analytics</h3>
            <p className="text-gray-600 leading-relaxed">Track usage patterns, conversation insights, and performance metrics with detailed analytics dashboard.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Team Collaboration</h3>
            <p className="text-gray-600 leading-relaxed">Share conversations, collaborate on projects, and manage team access with advanced permission controls.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Custom Integrations</h3>
            <p className="text-gray-600 leading-relaxed">Connect with your favorite tools and services through our comprehensive API and webhook system.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start your free trial and discover how ChatBot Pro can transform your workflow.
          </p>
          <a
            href="/"
            className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Start Free Trial
          </a>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

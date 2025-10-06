import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default function Security() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Enterprise-Grade Security
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Your data security is our top priority. We implement industry-leading security measures to protect your conversations and information.
          </p>
        </div>
      </div>

      {/* Security Features */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">End-to-End Encryption</h3>
              <p className="text-gray-600 leading-relaxed">All conversations are encrypted in transit and at rest using AES-256 encryption, ensuring your data remains private and secure.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">SOC 2 Compliance</h3>
              <p className="text-gray-600 leading-relaxed">We maintain SOC 2 Type II certification, demonstrating our commitment to security, availability, and confidentiality.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Access Controls</h3>
              <p className="text-gray-600 leading-relaxed">Advanced role-based access controls ensure that only authorized personnel can access sensitive data and administrative functions.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Audit Logging</h3>
              <p className="text-gray-600 leading-relaxed">Comprehensive audit logs track all system access and data modifications, providing complete visibility into system activity.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Data Residency</h3>
              <p className="text-gray-600 leading-relaxed">Choose your data residency region to ensure compliance with local data protection regulations and requirements.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Regular Security Updates</h3>
              <p className="text-gray-600 leading-relaxed">We continuously monitor and update our security measures to protect against emerging threats and vulnerabilities.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compliance & Certifications</h2>
            <p className="text-lg text-gray-600">We meet the highest standards for data protection and security</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-gray-600">SOC 2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-gray-600">Security, availability, and confidentiality controls</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-gray-600">GDPR</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">GDPR Compliant</h3>
              <p className="text-sm text-gray-600">European data protection regulation compliance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-gray-600">ISO</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
              <p className="text-sm text-gray-600">Information security management system</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-gray-600">CCPA</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">CCPA Ready</h3>
              <p className="text-sm text-gray-600">California Consumer Privacy Act compliance</p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

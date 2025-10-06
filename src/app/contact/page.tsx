import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Have questions about ChatBot Pro? We're here to help. Reach out to our team for support, sales inquiries, or partnership opportunities.
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Your Company"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                  <option>General Inquiry</option>
                  <option>Sales Question</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">support@chatbotpro.com</p>
                  <p className="text-gray-600">sales@chatbotpro.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600 text-sm">Mon-Fri 9AM-6PM PST</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                  <p className="text-gray-600">123 Business Street</p>
                  <p className="text-gray-600">San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Response Times</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• General inquiries: 24 hours</li>
                <li>• Technical support: 4 hours</li>
                <li>• Sales questions: 2 hours</li>
                <li>• Enterprise support: 1 hour</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

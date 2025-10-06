import React from 'react'

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            ChatBot Pro
          </span>
        </div>
        <nav className="flex space-x-8">
          <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</a>
          <a href="/features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
          <a href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
          <a href="/security" className="text-gray-900 font-medium">Security</a>
        </nav>
        <a
          href="/"
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
        >
          Get Started
        </a>
      </div>
    </div>
  </header>
  )
}

export default Header
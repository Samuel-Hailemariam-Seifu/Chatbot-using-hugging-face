import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for individuals',
      features: [
        '100 messages per month',
        'Basic AI models',
        'Conversation history',
        'Email support',
      ],
      cta: 'Get Started Free',
      href: '/',
      popular: false,
      style: 'bg-white/70 backdrop-blur-sm border border-white/50',
      btnStyle: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Best for growing teams',
      features: [
        'Unlimited messages',
        'Advanced AI models',
        'Team collaboration',
        'Priority support',
        'API access',
        'Custom integrations',
      ],
      cta: 'Start Pro Trial',
      href: '/',
      popular: true,
      style: 'bg-white border-2 border-primary-200 shadow-glow',
      btnStyle: 'gradient-bg text-white hover:shadow-glow',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'On-premise deployment',
        'Advanced security',
      ],
      cta: 'Contact Sales',
      href: '/contact',
      popular: false,
      style: 'bg-white/70 backdrop-blur-sm border border-white/50',
      btnStyle: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    },
  ]

  const faqs = [
    {
      q: 'Can I change plans anytime?',
      a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes, all paid plans come with a 14-day free trial. No credit card required to get started.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
    },
    {
      q: 'Can I cancel at any time?',
      a: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.',
    },
  ]

  return (
    <div className="min-h-screen mesh-gradient">
      <Header />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
        <div className="absolute top-10 left-20 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-accent-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-primary-100 shadow-sm">
            <span className="text-sm font-medium text-primary-600">Simple & transparent</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            Plans that <span className="gradient-text">scale with you</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your team. All plans include our core AI features with no hidden fees.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-3xl p-8 relative card-hover ${plan.style} ${plan.popular ? 'md:-mt-4 md:pb-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="gradient-bg text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-glow">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-slate-900">{plan.price}</span>
                  {plan.period !== 'forever' && plan.period !== 'contact us' && (
                    <span className="text-slate-500 text-sm ml-1">/{plan.period.replace('per ', '')}</span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-center block transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${plan.btnStyle}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
        <p className="text-slate-600 text-center mb-12">Everything you need to know about our plans.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-card">
              <h3 className="text-base font-semibold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

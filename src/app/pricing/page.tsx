import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying it out',
      features: [
        '100 messages per month',
        'Basic AI model',
        'Conversation history',
        'Email support',
      ],
      cta: 'Get Started Free',
      href: '/',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For professionals and teams',
      features: [
        'Unlimited messages',
        'Advanced AI models',
        'Team collaboration',
        'Priority support',
        'API access',
        'Custom system prompts',
      ],
      cta: 'Start Pro Trial',
      href: '/',
      popular: true,
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
    },
  ]

  const faqs = [
    {
      q: 'Can I change plans anytime?',
      a: 'Yes, you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.',
    },
    {
      q: 'Is there a free trial?',
      a: 'All paid plans come with a 14-day free trial. No credit card required to get started.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
    },
    {
      q: 'Can I cancel at any time?',
      a: 'Yes. You can cancel your subscription at any time with no cancellation fees.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-500">
            Choose the plan that fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 relative ${
                plan.popular
                  ? 'border-2 border-slate-900 md:-mt-2 md:pb-8'
                  : 'border border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.period !== 'forever' && plan.period !== 'contact us' && (
                    <span className="text-slate-400 text-sm">/{plan.period.replace('per ', '')}</span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-1.5">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm text-center block transition-colors ${
                  plan.popular
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{faq.q}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

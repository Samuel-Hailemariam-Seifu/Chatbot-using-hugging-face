import Link from "next/link";
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
      <section className="container-page pb-12 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-500">
            Choose the plan that fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container-page mx-auto max-w-5xl pb-20">
        <div className="grid items-start gap-5 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-xl p-6 ${
                plan.popular ? 'border-2 border-slate-900 shadow-elevated md:-mt-2 md:pb-8' : 'border border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                    Most popular
                  </span>
                </div>
              )}
              <div className="mb-6 text-center">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">{plan.price}</span>
                  {plan.period !== 'forever' && plan.period !== 'contact us' && (
                    <span className="text-sm text-slate-400">/{plan.period.replace('per ', '')}</span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-slate-500">{plan.description}</p>
              </div>
              <ul className="mb-6 space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page mx-auto max-w-3xl pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-slate-900">
          Frequently asked questions
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-5">
              <h3 className="mb-1.5 text-sm font-semibold text-slate-900">{faq.q}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

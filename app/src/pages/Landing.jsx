import { useState } from 'react'
import { Link } from 'react-router-dom'
import PrototypeTopBar from '@/components/PrototypeTopBar'
import DashboardMockup from '@/components/DashboardMockup'

const HOW_STEPS = [
  { num: 1, title: 'Upload your contacts', desc: 'Drag in your CSV — messy, incomplete, or duplicated. We handle the cleanup and map your columns automatically.' },
  { num: 2, title: 'Review your portfolio', desc: 'See your entire client base organized at a glance — equity positions, ownership timelines, and who\'s approaching a move window.' },
  { num: 3, title: 'Review & approve messages', desc: 'Every suggested touchpoint comes to you for review. One click to approve. Always your voice, your name, your relationship.' },
  { num: 4, title: 'Referrals follow naturally', desc: 'Clients who feel cared for talk. The system creates the conditions. The relationships do the rest.' },
]

const PRICING_TIERS = [
  { tier: 'Starter', price: 149, clients: 'Up to 150 clients', features: ['Client portfolio dashboard', 'Quarterly touchpoint queue', 'AI message suggestions', '150 AVM updates / month', 'Push, SMS, or email delivery'], featured: false },
  { tier: 'Growth', price: 249, clients: 'Up to 400 clients', features: ['Everything in Starter', 'Goal-aware messaging', 'Priority trigger alerts', '300 AVM updates / month', 'Client event creator', 'Equity trend reporting'], featured: true },
  { tier: 'Network', price: 399, clients: '500+ clients', features: ['Everything in Growth', 'Competitive monitoring', 'Predictive move scoring', '500 AVM updates / month', 'Concierge import support', 'White-glove onboarding'], featured: false },
]

const FAQ_ITEMS = [
  { q: 'Do my clients need to log in?', a: 'No. Updates are delivered via push notification, SMS, or email — whichever your client prefers. Optional deep links let curious clients explore more, but there\'s no required portal or account.' },
  { q: 'Will this feel automated or salesy to my clients?', a: 'Not at all. Every message is agent-signed, reviewed before sending, and focused on genuine service — not selling. The design philosophy is: if a thoughtful human wouldn\'t send this manually, it doesn\'t go out.' },
  { q: 'What data do I need to get started?', a: 'At minimum: name, contact info, property address, and closing date. Everything else — equity, market data, goals — is optional enrichment. We clean the rest on import.' },
  { q: 'How does the property value update system work?', a: 'We refresh home values quarterly by default. Your dashboard shows usage in real time. If you\'re approaching your monthly limit, refresh pauses automatically. Add-on packs are available anytime.' },
  { q: 'Is this visible to my clients as a third-party platform?', a: 'No. The platform is entirely invisible. Your name, your branding, your voice. Home Steward is the infrastructure — your clients only see you.' },
  { q: 'Can I cancel anytime?', a: 'Yes — month-to-month, no contracts. Your data exports cleanly. We\'d rather earn your continued business than lock you in.' },
]

export default function Landing() {
  const [activeTab, setActiveTab] = useState('marketing')
  const [faqOpen, setFaqOpen] = useState(null)

  // App tab views (mockups when not in marketing)
  if (activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-navy text-white overflow-x-hidden">
        <PrototypeTopBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-8 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-4xl">
            <DashboardMockup compact={false} />
          </div>
          <p className="mt-6 text-slate text-sm">Sign in to see your live dashboard and data.</p>
          <Link to="/login" className="mt-3 rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-navy no-underline hover:bg-gold-light">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  if (activeTab === 'import') {
    return (
      <div className="min-h-screen bg-navy text-white overflow-x-hidden">
        <PrototypeTopBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-8 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="rounded-2xl bg-navy-card border border-[var(--border)] p-8 max-w-xl w-full text-center">
            <div className="text-[10px] text-gold uppercase tracking-wider mb-2">Step 1 of 4</div>
            <h2 className="font-heading text-2xl text-white mb-2">Upload your contacts</h2>
            <p className="text-slate text-sm mb-6">Drop your CSV here or click to browse. We'll tidy and map columns for you.</p>
            <div className="rounded-xl border border-dashed border-slate-dim py-12 text-slate text-sm">Import flow preview — sign in to use</div>
          </div>
          <Link to="/login" className="mt-6 rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-navy no-underline hover:bg-gold-light">Sign in</Link>
        </div>
      </div>
    )
  }

  if (activeTab === 'compose') {
    return (
      <div className="min-h-screen bg-navy text-white overflow-x-hidden">
        <PrototypeTopBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-8 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="rounded-2xl bg-navy-card border border-[var(--border)] p-8 max-w-xl w-full text-center">
            <h2 className="font-heading text-2xl text-white mb-2">Touchpoint Compose</h2>
            <p className="text-slate text-sm mb-6">Review and send messages to clients. Message for Sarah Johnson, channel and tone options.</p>
            <div className="rounded-xl border border-[var(--border-soft)] py-12 text-slate text-sm">Compose preview — sign in to use</div>
          </div>
          <Link to="/login" className="mt-6 rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-navy no-underline hover:bg-gold-light">Sign in</Link>
        </div>
      </div>
    )
  }

  // Marketing Site tab: two-column landing + full sections
  return (
    <div className="min-h-screen bg-navy text-white overflow-x-hidden">
      <PrototypeTopBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Hero: marketing left + dashboard preview right */}
      <section className="pt-8 pb-20 px-6 md:px-15">
        <div className="max-w-[1200px] mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-gold mb-7">
              <span className="w-6 h-px bg-gold" /> For Solo Real Estate Agents
            </p>
            <h1 className="font-heading text-5xl md:text-[64px] font-normal leading-[1.05] text-white mb-6">
              Never let a <em className="italic font-light text-yellow">meaningful relationship</em> go quiet.
            </h1>
            <p className="text-base text-slate font-light leading-relaxed max-w-[460px] mb-10">
              A simple, agent-branded system that organizes your past clients, surfaces the moments that matter, and helps you stay present — without adding work.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-gold px-8 py-3.5 text-sm font-medium text-navy no-underline hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)] transition-all"
              >
                Start your private pilot
              </Link>
              <button type="button" onClick={() => setActiveTab('dashboard')} className="text-[13.5px] text-slate flex items-center gap-1.5 bg-transparent border-0 cursor-pointer hover:text-white-dim font-light">
                See a quick demo <span>→</span>
              </button>
            </div>
            <div className="flex items-center gap-5 mt-10 pt-8 border-t border-[var(--border-soft)]">
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-normal text-yellow">187</span>
                <span className="text-[11px] text-slate-dim uppercase tracking-wider">avg clients managed</span>
              </div>
              <div className="w-px h-9 bg-[var(--border)]" />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-normal text-yellow">4×</span>
                <span className="text-[11px] text-slate-dim uppercase tracking-wider">more referral contact</span>
              </div>
              <div className="w-px h-9 bg-[var(--border)]" />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-normal text-yellow">30 days</span>
                <span className="text-[11px] text-slate-dim uppercase tracking-wider">free pilot period</span>
              </div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <DashboardMockup compact />
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section id="features" className="py-24 bg-gradient-to-b from-navy to-navy-mid">
        <div className="max-w-[1200px] mx-auto px-6 md:px-15">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gold mb-5">
                <span className="w-5 h-px bg-gold" /> The reality
              </p>
              <h2 className="font-heading text-4xl md:text-[48px] font-normal leading-tight text-white mb-5">
                Most agents lose touch with <em className="italic text-yellow">90% of past clients</em> within two years.
              </h2>
              <p className="text-[15px] text-slate font-light leading-relaxed mb-6">
                Without a system, your database goes cold. Home Steward turns your closed transactions into a living relationship map — so you're there when they're ready to move again.
              </p>
            </div>
            <div className="space-y-0">
              <div className="flex gap-7 py-6 border-b border-[var(--border-soft)]">
                <span className="font-heading text-5xl font-light text-yellow shrink-0">71%</span>
                <div>
                  <div className="text-[15px] font-medium text-white mb-1">of referrals come from past clients</div>
                  <div className="text-[13px] text-slate font-light leading-relaxed">Staying in touch is the single highest-leverage activity for repeat and referral business.</div>
                </div>
              </div>
              <div className="flex gap-7 py-6 border-b border-[var(--border-soft)]">
                <span className="font-heading text-5xl font-light text-yellow shrink-0">5–7</span>
                <div>
                  <div className="text-[15px] font-medium text-white mb-1">years: peak move-intent window</div>
                  <div className="text-[13px] text-slate font-light leading-relaxed">Ownership year 5–7 is when homeowners are most likely to consider a change. We flag them for you.</div>
                </div>
              </div>
              <div className="flex gap-7 py-6">
                <span className="font-heading text-5xl font-light text-yellow shrink-0">1</span>
                <div>
                  <div className="text-[15px] font-medium text-white mb-1">agent at the center</div>
                  <div className="text-[13px] text-slate font-light leading-relaxed">Every touchpoint is from you. Your brand, your voice, your relationship. We're the invisible infrastructure.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 border-t border-[var(--border-soft)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-15">
          <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-gold mb-4">
            <span className="w-5 h-px bg-gold" /> Getting Started
          </p>
          <h2 className="font-heading text-4xl md:text-[44px] font-normal text-white mb-16 max-w-[480px] leading-tight">
            Up and running in <em className="italic font-light text-yellow">under an hour</em>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {HOW_STEPS.map((step) => (
              <div key={step.num} className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-yellow flex items-center justify-center mb-4">
                  <span className="font-heading text-xl font-normal text-yellow">{step.num}</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-navy-mid to-navy border-t border-[var(--border-soft)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-15">
          <div className="text-center mb-16">
            <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-gold mb-4">
              <span className="w-5 h-px bg-gold" /> Simple Pricing
            </p>
            <h2 className="font-heading text-4xl md:text-[44px] font-normal text-white mb-4 leading-tight">
              One deal pays for <em className="italic font-light text-yellow">years of this</em>
            </h2>
            <p className="text-slate text-sm max-w-[420px] mx-auto">
              Agents already spend more on Zillow leads that don&apos;t convert. One referral from a past client changes the math entirely.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {PRICING_TIERS.map((plan) => (
              <div
                key={plan.tier}
                className={`rounded-2xl border p-6 flex flex-col ${
                  plan.featured
                    ? 'border-yellow bg-navy-card shadow-[0_0_0_1px_rgba(201,168,76,0.25)]'
                    : 'border-[var(--border)] bg-navy-card'
                }`}
              >
                {plan.featured && (
                  <div className="text-[10px] tracking-wider uppercase text-navy bg-yellow font-medium px-2 py-1 rounded w-fit mb-4">
                    Most Popular
                  </div>
                )}
                <div className="font-heading text-xl font-medium text-white mb-1">{plan.tier}</div>
                <div className="flex items-baseline gap-0.5 mb-1">
                  <span className="text-lg text-slate">$</span>
                  <span className="font-heading text-4xl font-normal text-yellow">{plan.price}</span>
                  <span className="text-slate text-base ml-0.5">/mo</span>
                </div>
                <div className="text-xs text-slate mb-6">{plan.clients}</div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="text-[13px] text-white-dim flex items-start gap-2">
                      <span className="text-yellow mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block text-center rounded-lg py-3 text-sm font-medium no-underline transition-all ${
                    plan.featured
                      ? 'bg-yellow text-navy hover:bg-gold-light'
                      : 'border border-[var(--border)] text-slate hover:border-gold-dim hover:text-yellow'
                  }`}
                >
                  Start 30-day pilot
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate">
            Need more value updates? Add-on packs: <span className="text-yellow">500 updates — $35</span> · <span className="text-yellow">1,500 updates — $95</span>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 border-t border-[var(--border-soft)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-15">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 md:gap-16">
            <h2 className="font-heading text-2xl md:text-3xl font-normal text-white">
              Questions worth asking
            </h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--border-soft)] bg-navy-card overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-navy-hover transition-colors"
                  >
                    <span className="text-[15px] font-medium text-white">{item.q}</span>
                    <span className="text-yellow shrink-0 text-lg">{faqOpen === i ? '−' : '+'}</span>
                  </button>
                  {faqOpen === i && (
                    <div className="px-5 pb-4 pt-0">
                      <p className="text-sm text-slate font-light leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[var(--border-soft)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-15 text-center">
          <h2 className="font-heading text-4xl md:text-[52px] font-normal text-white mb-4 leading-tight">
            Your database is <em className="italic font-light text-yellow">already your best asset.</em>
          </h2>
          <p className="text-slate max-w-xl mx-auto mb-8">
            Start your 30-day private pilot. Upload your contacts. See your portfolio organized in minutes. No commitment required.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-gold px-10 py-4 text-base font-medium text-navy no-underline hover:bg-gold-light hover:-translate-y-0.5 transition-all"
          >
            Start your private pilot
          </Link>
          <p className="text-[12px] text-slate-dim mt-6 tracking-wide">30-day pilot · No credit card required · Your data stays yours</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border-soft)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-15 flex flex-wrap items-center justify-between gap-4">
          <div className="font-heading text-lg font-medium text-yellow">Home Steward</div>
          <div className="flex gap-8 text-[12px] text-slate-dim">
            <a href="/privacy" className="no-underline hover:text-gold transition-colors">Privacy</a>
            <a href="/terms" className="no-underline hover:text-gold transition-colors">Terms</a>
            <a href="/help" className="no-underline hover:text-gold transition-colors">Help</a>
          </div>
          <div className="text-[11px] text-slate-dim">© {new Date().getFullYear()} Home Steward. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

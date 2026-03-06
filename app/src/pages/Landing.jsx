import { useState } from 'react'
import { Link } from 'react-router-dom'
import PrototypeTopBar from '@/components/PrototypeTopBar'
import DashboardMockup from '@/components/DashboardMockup'

export default function Landing() {
  const [activeTab, setActiveTab] = useState('marketing')

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

      {/* CTA */}
      <section id="pricing" className="py-24 border-t border-[var(--border-soft)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-15 text-center">
          <h2 className="font-heading text-4xl md:text-[52px] font-normal text-white mb-4">
            Ready to steward your book?
          </h2>
          <p className="text-slate max-w-xl mx-auto mb-8">
            30-day free pilot. No credit card required. Import your first list in minutes.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-gold px-10 py-4 text-base font-medium text-navy no-underline hover:bg-gold-light hover:-translate-y-0.5 transition-all"
          >
            Start your private pilot
          </Link>
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

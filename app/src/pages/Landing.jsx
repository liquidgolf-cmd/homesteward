import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-15 transition-all border-b border-transparent scrolled:bg-navy/90 scrolled:border-[var(--border)]">
        <Link to="/" className="flex flex-col no-underline">
          <span className="font-heading text-xl font-medium text-gold-light tracking-wide">Home Steward</span>
          <span className="text-[10px] text-slate tracking-[0.18em] uppercase">Client Relationship OS</span>
        </Link>
        <div className="flex items-center gap-6 md:gap-8">
          <a href="#features" className="text-[13px] text-slate no-underline hover:text-white transition-colors">Features</a>
          <a href="#how" className="text-[13px] text-slate no-underline hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="text-[13px] text-slate no-underline hover:text-white transition-colors">Pricing</a>
          <Link to="/login" className="text-[13px] text-white-dim no-underline hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-gold px-5 py-2.5 text-[13px] font-medium text-navy no-underline hover:bg-gold-light hover:-translate-y-0.5 transition-all"
          >
            Start your pilot
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center relative pt-24 pb-20 px-6 md:px-15">
        <div className="max-w-[1200px] mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-gold mb-7">
              <span className="w-6 h-px bg-gold" /> For Solo Real Estate Agents
            </p>
            <h1 className="font-heading text-5xl md:text-[64px] font-normal leading-[1.05] text-white mb-6">
              Never let a <em className="italic font-light text-gold-light">meaningful relationship</em> go quiet.
            </h1>
            <p className="text-base text-slate font-light leading-relaxed max-w-[460px] mb-10">
              Home Steward keeps your past clients in your orbit with timely, agent-branded touchpoints — so you stay top of mind when it matters.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-gold px-8 py-3.5 text-sm font-medium text-navy no-underline hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)] transition-all"
              >
                Start your private pilot
              </Link>
              <button type="button" className="text-[13.5px] text-slate flex items-center gap-1.5 bg-transparent border-0 cursor-pointer hover:text-white-dim font-light">
                See a quick demo <span>→</span>
              </button>
            </div>
            <div className="flex items-center gap-5 mt-10 pt-8 border-t border-[var(--border-soft)]">
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-normal text-gold-light">187</span>
                <span className="text-[11px] text-slate-dim uppercase tracking-wider">avg clients under care</span>
              </div>
              <div className="w-px h-9 bg-[var(--border)]" />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-normal text-gold-light">4×</span>
                <span className="text-[11px] text-slate-dim uppercase tracking-wider">referral contact rate</span>
              </div>
              <div className="w-px h-9 bg-[var(--border)]" />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-normal text-gold-light">30 days</span>
                <span className="text-[11px] text-slate-dim uppercase tracking-wider">free pilot</span>
              </div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="rounded-2xl bg-navy-card border border-[var(--border)] overflow-hidden shadow-2xl">
              <div className="bg-navy-mid border-b border-[var(--border-soft)] px-4 py-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber" />
                <span className="w-2.5 h-2.5 rounded-full bg-green" />
                <span className="ml-2 text-[11px] text-slate tracking-wider">homesteward.app — Dashboard</span>
              </div>
              <div className="p-5">
                <div className="font-heading text-lg text-white mb-1">Good morning, Mike.</div>
                <div className="text-[10px] text-slate-dim mb-4">Thursday, March 5, 2026 · Q1 Active Period</div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-lg bg-navy-light border border-[var(--border-soft)] p-3">
                    <div className="text-[9px] text-slate-dim uppercase tracking-wider">Households</div>
                    <div className="font-heading text-2xl text-gold-light">187</div>
                  </div>
                  <div className="rounded-lg bg-navy-light border border-[var(--border-soft)] p-3">
                    <div className="text-[9px] text-slate-dim uppercase tracking-wider">Touchpoints</div>
                    <div className="text-xl text-white-dim">4</div>
                  </div>
                </div>
                <div className="rounded-lg bg-navy-light border border-[var(--border-soft)] p-3">
                  <div className="text-[10px] text-slate-dim uppercase mb-2">Touchpoint Queue</div>
                  <div className="flex items-center gap-2 py-2 border-b border-white/5">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold">SJ</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-white-dim">Sarah Johnson</div>
                      <div className="text-[10px] text-slate truncate">5-year milestone · 3 homes sold nearby</div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--gold-glow)] text-gold">Review</span>
                  </div>
                </div>
              </div>
            </div>
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
                Most agents lose touch with <em className="italic text-gold-light">90% of past clients</em> within two years.
              </h2>
              <p className="text-[15px] text-slate font-light leading-relaxed mb-6">
                Without a system, your database goes cold. Home Steward turns your closed transactions into a living relationship map — so you're there when they're ready to move again.
              </p>
            </div>
            <div className="space-y-0">
              <div className="flex gap-7 py-6 border-b border-[var(--border-soft)]">
                <span className="font-heading text-5xl font-light text-gold shrink-0">71%</span>
                <div>
                  <div className="text-[15px] font-medium text-white mb-1">of referrals come from past clients</div>
                  <div className="text-[13px] text-slate font-light leading-relaxed">Staying in touch is the single highest-leverage activity for repeat and referral business.</div>
                </div>
              </div>
              <div className="flex gap-7 py-6 border-b border-[var(--border-soft)]">
                <span className="font-heading text-5xl font-light text-gold shrink-0">5–7</span>
                <div>
                  <div className="text-[15px] font-medium text-white mb-1">years: peak move-intent window</div>
                  <div className="text-[13px] text-slate font-light leading-relaxed">Ownership year 5–7 is when homeowners are most likely to consider a change. We flag them for you.</div>
                </div>
              </div>
              <div className="flex gap-7 py-6">
                <span className="font-heading text-5xl font-light text-gold shrink-0">1</span>
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
      <section className="py-24 border-t border-[var(--border-soft)]">
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
          <div className="font-heading text-lg font-medium text-gold-light">Home Steward</div>
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

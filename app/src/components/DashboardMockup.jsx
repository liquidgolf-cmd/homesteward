export default function DashboardMockup({ compact = false }) {
  return (
    <div className={`rounded-2xl bg-navy-card border border-[var(--border)] overflow-hidden shadow-2xl ${compact ? '' : 'max-w-2xl'}`}>
      <div className="bg-navy-mid border-b border-[var(--border-soft)] px-4 py-3 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber" />
        <span className="w-2.5 h-2.5 rounded-full bg-green" />
        <span className="ml-2 text-[11px] text-slate tracking-wider">homesteward.app — Mike Smith — Dashboard</span>
      </div>
      <div className="p-5">
        <div className="font-heading text-lg text-white mb-1">Good morning, Mike.</div>
        <div className="text-[10px] text-slate-dim uppercase tracking-wider mb-4">Thursday, March 5, 2026 · Q1 Active Period</div>

        <div className={`grid gap-2 mb-4 grid-cols-3`}>
          <div className={`rounded-xl bg-navy-light border border-[var(--border-soft)] ${compact ? 'p-2' : 'p-4'}`}>
            <div className="text-[9px] text-slate-dim uppercase tracking-wider">Households</div>
            <div className={`font-heading text-white mt-0.5 ${compact ? 'text-xl' : 'text-3xl'}`}>187</div>
            <div className="text-[10px] text-slate mt-1">under care</div>
          </div>
          <div className={`rounded-xl bg-navy-light border border-[var(--border-soft)] ${compact ? 'p-2' : 'p-4'}`}>
            <div className="text-[9px] text-slate-dim uppercase tracking-wider">Priority Triggers</div>
            <div className={`font-heading text-white mt-0.5 ${compact ? 'text-xl' : 'text-3xl'}`}>3</div>
            <div className="text-[10px] text-slate mt-1">action ready</div>
          </div>
          <div className={`rounded-xl bg-navy-light border border-[var(--border-soft)] ${compact ? 'p-2' : 'p-4'}`}>
            <div className="text-[9px] text-slate-dim uppercase tracking-wider">Pending Touchpoints</div>
            <div className={`font-heading text-white mt-0.5 ${compact ? 'text-xl' : 'text-3xl'}`}>7</div>
            <div className="text-[10px] text-slate mt-1">3 high priority</div>
          </div>
        </div>

        <div className="rounded-xl bg-navy-light border border-[var(--border-soft)] p-4 mb-4">
          <div className="text-[9px] text-slate-dim uppercase tracking-wider mb-1">Portfolio Equity</div>
          <div className="text-2xl font-medium text-green">$22.4M</div>
          <div className="text-[11px] text-slate">187 households</div>
          <div className="text-[11px] text-green mt-0.5">↑ 11.2% this year</div>
        </div>

        <div className="rounded-xl bg-navy-light border border-[var(--border-soft)] p-3">
          <div className="text-[10px] text-slate-dim uppercase tracking-wider mb-2">Meaningful Touchpoints</div>
          {[
            { initials: 'SJ', name: 'Sarah Johnson', tag: 'Equity +12%', tagColor: 'green' },
            { initials: 'DL', name: 'David Lee', tag: 'Year 7', tagColor: 'gold' },
            { initials: 'AP', name: 'Amanda & Peter Cruz', tag: 'Q1 Check-in', tagColor: 'gold' },
          ].map((row) => (
            <div key={row.initials} className="flex items-center gap-2 py-2.5 border-b border-white/5 last:border-0">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold font-medium shrink-0">
                {row.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-white-dim font-medium">{row.name}</div>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded border shrink-0 ${
                row.tagColor === 'green' ? 'bg-green/10 text-green border-green/20' : 'bg-[var(--gold-glow)] text-gold border-gold/20'
              }`}>
                {row.tag}
              </span>
              <span className="text-[9px] px-2 py-1 rounded bg-[var(--gold-glow)] text-gold border border-gold/20 shrink-0">Review</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

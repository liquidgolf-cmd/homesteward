import { Link } from 'react-router-dom'
import { useAgentStats } from '@/hooks/useAgentStats'
import { useAuth } from '@/contexts/AuthContext'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Topbar() {
  const { user, agentId } = useAuth()
  const { avmUsed, avmQuota } = useAgentStats(agentId)
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-9 py-5 border-b border-[var(--border-soft)] bg-navy">
      <div className="flex flex-col">
        <h1 className="font-heading text-[28px] font-normal text-white tracking-tight leading-none">
          {getGreeting()}, {firstName}.
        </h1>
        <p className="text-xs text-slate mt-1 font-light tracking-wide">
          {formatDate()} · Q1 Active Period
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/avm-meter"
          className="flex items-center gap-2.5 bg-navy-card border border-[var(--border)] rounded-full py-2 px-4 cursor-pointer transition-all hover:border-gold-dim hover:bg-navy-hover no-underline"
        >
          <span className="text-[11px] tracking-wider uppercase text-slate">Value Updates</span>
          <span className="w-20 h-1.5 bg-navy-light rounded overflow-hidden">
            <span
              className="block h-full rounded bg-gradient-to-r from-gold-dim to-gold"
              style={{ width: `${Math.min(100, (avmUsed ?? 0) / (avmQuota || 300) * 100)}%` }}
            />
          </span>
          <span className="text-xs font-medium text-white">
            {avmUsed ?? 0} / {avmQuota ?? 300}
          </span>
        </Link>
        <button
          type="button"
          className="w-9 h-9 bg-navy-card border border-[var(--border)] rounded-lg flex items-center justify-center text-slate hover:border-gold-dim hover:text-gold-light transition-colors"
          aria-label="Notifications"
        >
          <span className="relative">
            ◔
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold" />
          </span>
        </button>
        <Link
          to="/add-homeowner"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-[13px] text-navy bg-gold border-0 cursor-pointer transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(201,168,76,0.25)] no-underline"
        >
          + Add Client
        </Link>
      </div>
    </header>
  )
}

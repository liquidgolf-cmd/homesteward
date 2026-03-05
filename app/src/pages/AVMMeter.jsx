import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useAgentStats } from '@/hooks/useAgentStats'

export default function AVMMeter() {
  const { agentId } = useAuth()
  const { avmUsed, avmQuota } = useAgentStats(agentId)
  const used = avmUsed ?? 0
  const quota = avmQuota ?? 300
  const pct = quota ? Math.min(100, (used / quota) * 100) : 0
  const estimated = (used * 0.1).toFixed(2)

  return (
    <div className="p-9 max-w-lg space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-normal text-white">Property value update usage</h1>
        <p className="text-slate mt-1">
          We refresh home values quarterly by default to keep your data current without unnecessary costs.
        </p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-navy-card p-6 text-center">
        <p className="text-2xl font-medium text-gold-light">{used} / {quota} updates used</p>
        <p className="text-sm text-slate mt-1">Estimated cost: ${estimated}</p>
        <div className="mt-4 h-2 bg-navy-light rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-navy-card p-6">
        <h2 className="font-medium text-white">This month's activity</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate">
          <li>Automatic quarterly refresh — 0</li>
          <li>On-demand checks — 0</li>
          <li>Import enrichment — 0</li>
        </ul>
        <p className="text-xs text-slate-dim mt-4">AVM lookups will appear here in Phase 3.</p>
      </div>
      <div className="space-y-3">
        <button type="button" className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-navy hover:bg-gold-light">
          Purchase add-on
        </button>
        <button type="button" className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-slate hover:border-gold-dim hover:text-gold">
          Change refresh cadence
        </button>
        <div className="flex items-center justify-between pt-2">
          <label htmlFor="pause-avm" className="text-sm text-slate">Pause value refresh</label>
          <input id="pause-avm" type="checkbox" className="rounded border-slate-dim" />
        </div>
      </div>
      <p className="text-xs text-slate-dim">
        Only successful updates count toward your total. Meter resets on the 1st of each period.
      </p>
      <Link to="/" className="inline-block rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-slate hover:text-gold no-underline">
        Back to dashboard
      </Link>
    </div>
  )
}

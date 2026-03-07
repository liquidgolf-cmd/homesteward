import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { useAgentStats } from '@/hooks/useAgentStats'
import { deriveSuggestedTouchpoints } from '@/lib/suggestedTouchpoints'

const QUICK_ACTIONS = [
  { to: '/touchpoints', icon: '📋', label: 'Review\nTouchpoints' },
  { to: '/import', icon: '⬆', label: 'Import\nClients' },
  { to: '/create-event', icon: '🗓', label: 'Create\nEvent' },
  { to: '/equity-map', icon: '📊', label: 'Equity\nReport' },
]

export default function Dashboard() {
  const { agentId } = useAuth()
  const { homeownerCount, touchpointCount, avmUsed, avmQuota, entering5to7Count, priorityTriggerCount } = useAgentStats(agentId)
  const [touchpointsPreview, setTouchpointsPreview] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!agentId) return
    let cancelled = false
    async function load() {
      try {
        const [tpSnap, homeSnap, txSnap] = await Promise.all([
          getDocs(query(collection(db, 'agents', agentId, 'touchpoints'), orderBy('scheduledFor', 'asc'), limit(6))),
          getDocs(query(collection(db, 'agents', agentId, 'homeowners'), orderBy('createdAt', 'desc'))),
          getDocs(collection(db, 'agents', agentId, 'transactions')),
        ])
        if (cancelled) return
        const tpDocs = tpSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        if (tpDocs.length > 0) {
          setTouchpointsPreview(tpDocs)
        } else {
          const homeowners = homeSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
          const transactions = txSnap.docs.map((d) => ({ ...d.data(), homeownerId: d.data().homeownerId }))
          const suggested = deriveSuggestedTouchpoints(homeowners, transactions)
          setTouchpointsPreview(suggested.slice(0, 6))
        }
      } catch {
        if (!cancelled) setTouchpointsPreview([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [agentId])

  const count = homeownerCount ?? 0
  // Show empty state until we know there are homeowners (avoids loading flash for new users)
  const showEmpty = (homeownerCount == null || homeownerCount === 0)
  const tpCount = touchpointCount ?? 0

  if (showEmpty) {
    return (
      <div className="p-9 max-w-2xl">
        <div className="rounded-xl border border-[var(--border)] bg-navy-card p-8 text-center">
          <h2 className="font-heading text-xl font-medium text-white">Looks quiet in here.</h2>
          <p className="text-slate mt-2">
            Upload a CSV of past clients to start stewarding your portfolio.
          </p>
          <Link
            to="/import"
            className="mt-4 inline-block rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-navy hover:bg-gold-light no-underline"
          >
            Upload contacts (CSV)
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-9 overflow-auto">
      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {QUICK_ACTIONS.map(({ to, icon, label }) => (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center gap-3 p-5 rounded-xl bg-navy-card border border-[var(--border)] hover:border-gold-dim hover:bg-navy-hover transition-all no-underline text-center"
          >
            <span className="text-xl text-white">{icon}</span>
            <span className="text-[11.5px] text-white font-normal leading-snug whitespace-pre-line">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl bg-navy-card border border-[var(--border)] p-5 hover:border-[rgba(201,168,76,0.25)] transition-colors relative overflow-hidden">
          <div className="text-[10px] tracking-wider uppercase text-slate-dim font-medium">Households Under Care</div>
          <div className="font-heading text-3xl font-normal text-yellow mt-1">{loading ? '…' : count}</div>
          <div className="text-xs text-slate mt-1">across your portfolio</div>
        </div>
        <div className="rounded-xl bg-navy-card border border-[var(--border)] p-5 hover:border-[rgba(255,255,255,0.08)] transition-colors">
          <div className="text-[10px] tracking-wider uppercase text-slate-dim font-medium">Touchpoints This Quarter</div>
          <div className="text-2xl font-medium text-yellow mt-1">{tpCount}</div>
          <div className="text-xs text-slate mt-1">meaningful outreaches</div>
        </div>
        <div className="rounded-xl bg-navy-card border border-[var(--border)] p-5 hover:border-[rgba(255,255,255,0.08)] transition-colors">
          <div className="text-[10px] tracking-wider uppercase text-slate-dim font-medium">Priority Triggers</div>
          <div className="text-2xl font-medium text-yellow mt-1">{priorityTriggerCount ?? 0}</div>
          <div className="text-xs text-slate mt-1">action ready</div>
        </div>
        <div className="rounded-xl bg-navy-card border border-[var(--border)] p-5 hover:border-[rgba(255,255,255,0.08)] transition-colors">
          <div className="text-[10px] tracking-wider uppercase text-slate-dim font-medium">Entering 5–7 Yr Window</div>
          <div className="text-2xl font-medium text-yellow mt-1">{entering5to7Count ?? 0}</div>
          <div className="text-xs text-slate mt-1">clients flagged</div>
        </div>
      </div>

      {/* Section divider */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[10px] tracking-[0.2em] uppercase text-slate-dim font-medium whitespace-nowrap">
          This Quarter — Meaningful Touchpoints
        </span>
        <div className="flex-1 h-px bg-[var(--border-soft)]" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Touchpoint Queue */}
        <div className="lg:col-span-2 rounded-xl bg-navy-card border border-[var(--border)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-soft)]">
            <span className="text-sm font-medium text-white">Touchpoint Queue</span>
            <Link to="/touchpoints" className="text-xs text-yellow hover:text-gold-light no-underline transition-colors">
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-[var(--border-soft)]">
            {loading ? (
              <li className="px-5 py-6 text-slate text-sm">Loading…</li>
            ) : touchpointsPreview.length === 0 ? (
              <li className="px-5 py-8 text-slate text-sm">
                No meaningful touchpoints this quarter. We'll let you know when something comes up.
              </li>
            ) : (
              touchpointsPreview.map((t) => {
                const name = t.homeownerName || t.homeownerId || 'Client'
                const initials = name.split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2)
                return (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-navy-hover transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber shrink-0" title="Priority" />
                    <div className="w-9 h-9 rounded-full bg-navy-light border border-[var(--border)] flex items-center justify-center text-xs font-medium text-white-dim shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-white truncate">{name}</div>
                      <div className="text-[11.5px] text-slate truncate">{t.reason || t.type || '—'}</div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(62,180,137,0.12)] text-green border border-[rgba(62,180,137,0.2)]">
                        Touchpoint
                      </span>
                    </div>
                    <Link
                      to={t.homeownerId ? `/touchpoints/compose?homeownerId=${t.homeownerId}` : '/touchpoints/compose'}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-yellow border border-yellow text-xs font-medium text-navy hover:bg-gold-light hover:border-gold-light transition-all no-underline"
                    >
                      Review & Send
                    </Link>
                  </li>
                )
              })
            )}
          </ul>
        </div>

        {/* Right column: Value Updates + optional Triggers */}
        <div className="flex flex-col gap-5">
          <div className="rounded-xl bg-navy-card border border-[var(--border)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-soft)]">
              <span className="text-sm font-medium text-white">Value Updates</span>
              <Link to="/avm-meter" className="text-xs text-yellow hover:text-gold-light no-underline transition-colors">
                Details →
              </Link>
            </div>
            <div className="p-5">
              <div className="text-center">
                <div className="font-heading text-[28px] font-normal text-yellow leading-none">{avmUsed ?? 0}</div>
                <div className="text-[10px] text-slate tracking-wider uppercase mt-0.5">of {avmQuota ?? 300}</div>
              </div>
              <div className="mt-3 h-1.5 bg-navy-light rounded overflow-hidden">
                <div
                  className="h-full rounded bg-gradient-to-r from-gold-dim to-gold transition-all"
                  style={{ width: `${Math.min(100, ((avmUsed ?? 0) / (avmQuota || 300)) * 100)}%` }}
                />
              </div>
              <div className="space-y-2 mt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate">Usage this period</span>
                  <span className="text-white-dim font-medium">{avmUsed ?? 0}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to="/avm-meter"
                  className="flex-1 py-2 rounded-lg border border-[var(--border)] text-xs text-slate hover:border-gold-dim hover:text-gold transition-colors text-center no-underline"
                >
                  Adjust Cadence
                </Link>
                <Link
                  to="/avm-meter"
                  className="flex-1 py-2 rounded-lg border border-[var(--border)] text-xs text-gold hover:bg-[var(--gold-glow)] hover:border-gold text-center no-underline transition-colors"
                >
                  Buy Add-on Pack
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-navy-card border border-[var(--border)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-soft)]">
              <span className="text-sm font-medium text-white">Priority Triggers</span>
              <Link to="/triggers" className="text-xs text-yellow hover:text-gold-light no-underline transition-colors">
                All triggers →
              </Link>
            </div>
            <div className="px-5 py-6 text-slate text-sm">
              Trigger detection coming in Phase 2.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

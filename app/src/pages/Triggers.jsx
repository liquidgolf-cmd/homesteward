import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { deriveSuggestedTouchpoints } from '@/lib/suggestedTouchpoints'

export default function Triggers() {
  const { agentId } = useAuth()
  const [triggers, setTriggers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!agentId) return
    let cancelled = false
    async function load() {
      try {
        const [homeSnap, txSnap] = await Promise.all([
          getDocs(query(collection(db, 'agents', agentId, 'homeowners'), orderBy('createdAt', 'desc'))),
          getDocs(collection(db, 'agents', agentId, 'transactions')),
        ])
        if (cancelled) return
        const homeowners = homeSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        const transactions = txSnap.docs.map((d) => ({ ...d.data(), homeownerId: d.data().homeownerId }))
        setTriggers(deriveSuggestedTouchpoints(homeowners, transactions))
      } catch {
        if (!cancelled) setTriggers([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [agentId])

  return (
    <div className="p-9 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-normal text-white">Priority Triggers</h1>
        <p className="text-slate mt-1">Clients matching trigger rules — reach out or add to your touchpoint queue.</p>
      </div>

      {loading ? (
        <p className="text-slate">Loading…</p>
      ) : triggers.length === 0 ? (
        <p className="text-slate">
          No clients match trigger rules right now. Triggers include: Entering 5–7 Yr Window (closing date 5–7 years ago).
        </p>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-navy-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-soft)]">
                  <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium">Client</th>
                  <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium">Trigger</th>
                  <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium w-48"></th>
                </tr>
              </thead>
              <tbody>
                {triggers.map((t, i) => (
                  <tr
                    key={t.homeownerId || i}
                    className="border-b border-[var(--border-soft)] last:border-0 hover:bg-navy-hover transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        to={`/clients/${t.homeownerId}`}
                        className="font-medium text-white hover:text-gold-light no-underline"
                      >
                        {t.homeownerName || '—'}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate">{t.reason || t.type || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/touchpoints/compose?homeownerId=${t.homeownerId}`}
                          className="rounded-lg bg-gold px-3 py-2 text-xs font-medium text-navy hover:bg-gold-light no-underline"
                        >
                          Compose
                        </Link>
                        <Link
                          to={`/clients/${t.homeownerId}`}
                          className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-slate hover:border-gold-dim hover:text-gold no-underline"
                        >
                          Client
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-sm text-slate">
        <Link to="/" className="text-gold-light hover:text-gold no-underline">Back to dashboard</Link>
      </p>
    </div>
  )
}

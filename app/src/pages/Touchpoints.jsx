import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { deriveSuggestedTouchpoints } from '@/lib/suggestedTouchpoints'

const FILTERS = ['All', 'Priority', 'New', 'RSVP']

export default function Touchpoints() {
  const { agentId } = useAuth()
  const [filter, setFilter] = useState('All')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!agentId) return
    let cancelled = false
    async function load() {
      try {
        const [tpSnap, homeSnap, txSnap] = await Promise.all([
          getDocs(query(collection(db, 'agents', agentId, 'touchpoints'), orderBy('scheduledFor', 'asc'), limit(50))),
          getDocs(query(collection(db, 'agents', agentId, 'homeowners'), orderBy('createdAt', 'desc'))),
          getDocs(collection(db, 'agents', agentId, 'transactions')),
        ])
        if (cancelled) return
        const tpDocs = tpSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        if (tpDocs.length > 0) {
          setItems(tpDocs)
        } else {
          const homeowners = homeSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
          const transactions = txSnap.docs.map((d) => ({ ...d.data(), homeownerId: d.data().homeownerId }))
          setItems(deriveSuggestedTouchpoints(homeowners, transactions))
        }
      } catch {
        if (!cancelled) setItems([])
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
        <h1 className="font-heading text-2xl font-normal text-white">
          This quarter — meaningful touchpoints
        </h1>
        <p className="text-slate mt-1">Suggested messages — you choose to send or dismiss.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f ? 'bg-[var(--gold-glow)] border border-[rgba(201,168,76,0.25)] text-gold-light' : 'bg-navy-card border border-[var(--border-soft)] text-slate hover:bg-navy-hover'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-slate">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-slate">
          No meaningful touchpoints this quarter. We'll let you know when something comes up.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((t, i) => (
            <div key={t.id || i} className="rounded-xl border border-[var(--border)] bg-navy-card p-5">
              <p className="font-medium text-white">{t.homeownerName || t.homeownerId || '—'}</p>
              <p className="text-sm text-slate mt-0.5">{t.reason || t.type || '—'}</p>
              <div className="mt-4">
                <Link
                  to={t.homeownerId ? `/touchpoints/compose?homeownerId=${t.homeownerId}` : '/touchpoints/compose'}
                  className="inline-block rounded-lg bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light no-underline"
                >
                  Review & send
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-slate">
        <Link to="/" className="text-gold-light hover:text-gold no-underline">Back to dashboard</Link>
      </p>
    </div>
  )
}

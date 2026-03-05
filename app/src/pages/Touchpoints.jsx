import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

const FILTERS = ['All', 'Priority', 'New', 'RSVP']

export default function Touchpoints() {
  const { agentId } = useAuth()
  const [filter, setFilter] = useState('All')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!agentId) return
    let cancelled = false
    getDocs(
      query(
        collection(db, 'agents', agentId, 'touchpoints'),
        orderBy('scheduledFor', 'asc'),
        limit(50)
      )
    )
      .then((snap) => {
        if (!cancelled) setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      })
      .catch(() => { if (!cancelled) setItems([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
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
          {items.map((t) => (
            <div key={t.id} className="rounded-xl border border-[var(--border)] bg-navy-card p-5">
              <p className="font-medium text-white">{t.homeownerId || '—'}</p>
              <p className="text-sm text-slate mt-0.5">{t.type || '—'}</p>
              <div className="mt-4">
                <Link
                  to="/touchpoints/compose"
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

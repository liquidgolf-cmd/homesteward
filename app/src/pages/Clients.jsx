import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

export default function Clients() {
  const { agentId } = useAuth()
  const [homeowners, setHomeowners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!agentId) return
    let cancelled = false
    async function load() {
      try {
        const [homeSnap, propSnap, txSnap] = await Promise.all([
          getDocs(query(collection(db, 'agents', agentId, 'homeowners'), orderBy('createdAt', 'desc'))),
          getDocs(collection(db, 'agents', agentId, 'properties')),
          getDocs(collection(db, 'agents', agentId, 'transactions')),
        ])
        if (cancelled) return
        const props = {}
        propSnap.docs.forEach((d) => {
          const d2 = d.data()
          if (d2.homeownerId && !props[d2.homeownerId]) {
            props[d2.homeownerId] = { id: d.id, ...d2 }
          }
        })
        const txs = {}
        txSnap.docs.forEach((d) => {
          const d2 = d.data()
          if (d2.homeownerId && !txs[d2.homeownerId]) {
            txs[d2.homeownerId] = d2.closingDate
          }
        })
        const list = homeSnap.docs.map((d) => {
          const h = { id: d.id, ...d.data() }
          const prop = props[h.id]
          const closing = txs[h.id]
          return {
            ...h,
            address: prop ? [prop.addressLine1, prop.city, prop.state, prop.zip].filter(Boolean).join(', ') : null,
            closingDate: closing || null,
          }
        })
        setHomeowners(list)
      } catch {
        if (!cancelled) setHomeowners([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [agentId])

  const formatDate = (d) => {
    if (!d) return '—'
    const s = typeof d === 'string' ? d : (d?.toDate?.()?.toISOString?.() || '')
    if (!s) return '—'
    const y = s.slice(0, 4)
    const m = s.slice(5, 7)
    const day = s.slice(8, 10)
    if (m && day) return `${m}/${day}/${y}`
    return y
  }

  return (
    <div className="p-9 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-white">All Clients</h1>
          <p className="text-sm text-slate mt-1">
            {loading ? 'Loading…' : `${homeowners.length} household${homeowners.length === 1 ? '' : 's'} under care`}
          </p>
        </div>
        <Link
          to="/add-homeowner"
          className="inline-flex items-center justify-center rounded-lg bg-yellow px-5 py-2.5 text-sm font-medium text-navy no-underline hover:bg-gold-light transition-all shrink-0"
        >
          + Add Client
        </Link>
      </div>

      {loading ? (
        <div className="rounded-xl bg-navy-card border border-[var(--border)] p-12 text-center text-slate">
          Loading…
        </div>
      ) : homeowners.length === 0 ? (
        <div className="rounded-xl bg-navy-card border border-[var(--border)] p-12 text-center">
          <p className="font-heading text-xl font-medium text-white mb-2">No clients yet</p>
          <p className="text-slate text-sm mb-6">
            Add clients manually or import a CSV of past clients to get started.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/add-homeowner"
              className="inline-flex items-center justify-center rounded-lg bg-yellow px-5 py-2.5 text-sm font-medium text-navy no-underline hover:bg-gold-light"
            >
              + Add Client
            </Link>
            <Link
              to="/import"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-slate no-underline hover:border-gold-dim hover:text-yellow"
            >
              Import CSV
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-navy-card border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-soft)]">
                  <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium">Name</th>
                  <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium">Email</th>
                  <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium hidden md:table-cell">Phone</th>
                  <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium hidden lg:table-cell">Address</th>
                  <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium">Closed</th>
                  <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium w-24"></th>
                </tr>
              </thead>
              <tbody>
                {homeowners.map((h) => {
                  const name = [h.firstName, h.lastName].filter(Boolean).join(' ') || '—'
                  return (
                    <tr
                      key={h.id}
                      className="border-b border-[var(--border-soft)] last:border-0 hover:bg-navy-hover transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="font-medium text-white">{name}</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate">{h.email || '—'}</td>
                      <td className="px-5 py-3 text-sm text-slate hidden md:table-cell">{h.phone || '—'}</td>
                      <td className="px-5 py-3 text-sm text-slate hidden lg:table-cell max-w-[200px] truncate" title={h.address}>
                        {h.address || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-dim">{formatDate(h.closingDate)}</td>
                      <td className="px-5 py-3">
                        <Link
                          to={`/touchpoints/compose`}
                          className="text-xs text-yellow hover:text-gold-light no-underline"
                        >
                          Touchpoint
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

function toSortableDate(d) {
  if (!d) return ''
  const s = typeof d === 'string' ? d : (d?.toDate?.()?.toISOString?.() || '')
  return s || ''
}

export default function Clients() {
  const { agentId } = useAuth()
  const [homeowners, setHomeowners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

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

  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = q
      ? homeowners.filter((h) => {
          const searchable = [
            h.firstName,
            h.lastName,
            h.email,
            h.phone,
            h.address,
            h.notes,
            h.goals?.type,
          ].filter(Boolean).join(' ').toLowerCase()
          return searchable.includes(q)
        })
      : [...homeowners]
    const compare = (a, b) => {
      if (sortBy === 'name' || sortBy === 'nameDesc') {
        const nameA = [a.firstName, a.lastName].filter(Boolean).join(' ').toLowerCase()
        const nameB = [b.firstName, b.lastName].filter(Boolean).join(' ').toLowerCase()
        const cmp = nameA.localeCompare(nameB)
        return sortBy === 'nameDesc' ? -cmp : cmp
      }
      if (sortBy === 'closed' || sortBy === 'closedDesc') {
        const dateA = toSortableDate(a.closingDate)
        const dateB = toSortableDate(b.closingDate)
        const cmp = dateA.localeCompare(dateB)
        return sortBy === 'closedDesc' ? -cmp : cmp
      }
      return 0
    }
    list.sort(compare)
    return list
  }, [homeowners, searchQuery, sortBy])

  const handleSortName = () => {
    setSortBy((prev) => (prev === 'name' ? 'nameDesc' : 'name'))
  }
  const handleSortClosed = () => {
    setSortBy((prev) => (prev === 'closedDesc' ? 'closed' : 'closedDesc'))
  }

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
            {loading
              ? 'Loading…'
              : searchQuery.trim()
                ? `Showing ${filteredAndSorted.length} of ${homeowners.length} households`
                : `${homeowners.length} household${homeowners.length === 1 ? '' : 's'} under care`}
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
        <>
          <div className="mb-6">
            <input
              type="search"
              placeholder="Search by name, email, phone, or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full max-w-md rounded-lg border border-[var(--border-soft)] bg-navy-light px-4 py-2.5 text-sm text-white placeholder-slate-dim focus:border-gold-dim focus:outline-none"
              aria-label="Search clients"
            />
          </div>
          <div className="rounded-xl bg-navy-card border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    <th>
                      <button
                        type="button"
                        onClick={handleSortName}
                        className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium hover:text-yellow transition-colors flex items-center gap-1"
                      >
                        Name {sortBy === 'name' ? '↑' : sortBy === 'nameDesc' ? '↓' : ''}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium">Email</th>
                    <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium hidden md:table-cell">Phone</th>
                    <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium hidden lg:table-cell">Address</th>
                    <th>
                      <button
                        type="button"
                        onClick={handleSortClosed}
                        className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium hover:text-yellow transition-colors flex items-center gap-1"
                      >
                        Closed {sortBy === 'closed' ? '↑' : sortBy === 'closedDesc' ? '↓' : ''}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-[10px] tracking-wider uppercase text-slate-dim font-medium w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSorted.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate text-sm">
                        No clients match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSorted.map((h) => {
                  const name = [h.firstName, h.lastName].filter(Boolean).join(' ') || '—'
                  return (
                    <tr
                      key={h.id}
                      className="border-b border-[var(--border-soft)] last:border-0 hover:bg-navy-hover transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          to={`/clients/${h.id}`}
                          className="font-medium text-white hover:text-yellow no-underline"
                        >
                          {name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate">{h.email || '—'}</td>
                      <td className="px-5 py-3 text-sm text-slate hidden md:table-cell">{h.phone || '—'}</td>
                      <td className="px-5 py-3 text-sm text-slate hidden lg:table-cell max-w-[200px] truncate" title={h.address}>
                        {h.address || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-dim">{formatDate(h.closingDate)}</td>
                      <td className="px-5 py-3">
                        <Link
                          to={`/touchpoints/compose?homeownerId=${h.id}`}
                          className="text-xs text-yellow hover:text-gold-light no-underline"
                        >
                          Touchpoint
                        </Link>
                      </td>
                    </tr>
                  )
                }))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
    </div>
  )
}

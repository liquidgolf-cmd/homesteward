import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

const GOAL_OPTIONS = [
  'Upgrade (1–3 years)',
  'Upgrade (3–5 years)',
  'Long term',
  'Interested in investment',
  'Undecided',
]

function formatDate(d) {
  if (!d) return '—'
  const s = typeof d === 'string' ? d : (d?.toDate?.()?.toISOString?.() || '')
  if (!s) return '—'
  const y = s.slice(0, 4)
  const m = s.slice(5, 7)
  const day = s.slice(8, 10)
  if (m && day) return `${m}/${day}/${y}`
  return y
}

function toInputDate(d) {
  if (!d) return ''
  const s = typeof d === 'string' ? d : (d?.toDate?.()?.toISOString?.() || '')
  return s ? s.slice(0, 10) : ''
}

export default function ClientDashboard() {
  const { id } = useParams()
  const { agentId } = useAuth()
  const [homeowner, setHomeowner] = useState(null)
  const [property, setProperty] = useState(null)
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [saveError, setSaveError] = useState('')
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    if (!agentId || !id) return
    let cancelled = false
    async function load() {
      try {
        const [homeSnap, propSnap, txSnap] = await Promise.all([
          getDoc(doc(db, 'agents', agentId, 'homeowners', id)),
          getDocs(query(
            collection(db, 'agents', agentId, 'properties'),
            where('homeownerId', '==', id)
          )),
          getDocs(query(
            collection(db, 'agents', agentId, 'transactions'),
            where('homeownerId', '==', id)
          )),
        ])
        if (cancelled) return
        if (!homeSnap.exists()) {
          setNotFound(true)
          setLoading(false)
          return
        }
        setHomeowner({ id: homeSnap.id, ...homeSnap.data() })
        const propDoc = propSnap.docs[0]
        setProperty(propDoc ? { id: propDoc.id, ...propDoc.data() } : null)
        const txDoc = txSnap.docs[0]
        setTransaction(txDoc ? { id: txDoc.id, ...txDoc.data() } : null)
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [agentId, id])

  function startEdit(section, initial) {
    setEditingSection(section)
    setEditForm(initial)
    setSaveError('')
  }

  function cancelEdit() {
    setEditingSection(null)
    setEditForm({})
    setSaveError('')
  }

  async function saveContact() {
    setSaveError('')
    try {
      await updateDoc(doc(db, 'agents', agentId, 'homeowners', id), {
        firstName: (editForm.firstName || '').trim() || null,
        lastName: (editForm.lastName || '').trim() || null,
        email: (editForm.email || '').trim() || null,
        phone: (editForm.phone || '').trim() || null,
        preferredChannel: editForm.preferredChannel || 'email',
      })
      setHomeowner((prev) => ({ ...prev, ...editForm }))
      setEditingSection(null)
      setEditForm({})
    } catch (err) {
      setSaveError(err.message || 'Failed to save.')
    }
  }

  async function saveProperty() {
    if (!property) return
    setSaveError('')
    try {
      await updateDoc(doc(db, 'agents', agentId, 'properties', property.id), {
        addressLine1: (editForm.addressLine1 || '').trim() || null,
        city: (editForm.city || '').trim() || null,
        state: (editForm.state || '').trim() || null,
        zip: (editForm.zip || '').trim() || null,
      })
      setProperty((prev) => ({ ...prev, ...editForm }))
      setEditingSection(null)
      setEditForm({})
    } catch (err) {
      setSaveError(err.message || 'Failed to save.')
    }
  }

  async function saveTransaction() {
    if (!transaction) return
    setSaveError('')
    try {
      await updateDoc(doc(db, 'agents', agentId, 'transactions', transaction.id), {
        closingDate: editForm.closingDate || null,
        salePrice: editForm.salePrice != null && editForm.salePrice !== '' ? Number(editForm.salePrice) : null,
      })
      setTransaction((prev) => ({ ...prev, closingDate: editForm.closingDate, salePrice: editForm.salePrice }))
      setEditingSection(null)
      setEditForm({})
    } catch (err) {
      setSaveError(err.message || 'Failed to save.')
    }
  }

  async function saveGoals() {
    setSaveError('')
    try {
      await updateDoc(doc(db, 'agents', agentId, 'homeowners', id), {
        goals: editForm.goal ? { type: editForm.goal, timeframe: editForm.timeframe || '' } : null,
      })
      setHomeowner((prev) => ({
        ...prev,
        goals: editForm.goal ? { type: editForm.goal, timeframe: editForm.timeframe || '' } : null,
      }))
      setEditingSection(null)
      setEditForm({})
    } catch (err) {
      setSaveError(err.message || 'Failed to save.')
    }
  }

  async function saveNotes() {
    setSaveError('')
    try {
      await updateDoc(doc(db, 'agents', agentId, 'homeowners', id), {
        notes: (editForm.notes || '').trim() || null,
      })
      setHomeowner((prev) => ({ ...prev, notes: (editForm.notes || '').trim() || null }))
      setEditingSection(null)
      setEditForm({})
    } catch (err) {
      setSaveError(err.message || 'Failed to save.')
    }
  }

  const inputClass = 'mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-navy-light px-3 py-2 text-white placeholder-slate-dim focus:border-gold-dim focus:outline-none'
  const labelClass = 'block text-sm font-medium text-slate'
  const cardClass = 'rounded-xl border border-[var(--border)] bg-navy-card p-6'

  if (loading) {
    return (
      <div className="p-9">
        <div className={cardClass}>
          <p className="text-slate">Loading…</p>
        </div>
      </div>
    )
  }

  if (notFound || !homeowner) {
    return (
      <div className="p-9">
        <div className={cardClass}>
          <p className="text-slate mb-4">Client not found.</p>
          <Link to="/clients" className="text-yellow hover:text-gold-light no-underline">
            ← Back to All Clients
          </Link>
        </div>
      </div>
    )
  }

  const name = [homeowner.firstName, homeowner.lastName].filter(Boolean).join(' ') || '—'
  const address = property
    ? [property.addressLine1, property.city, property.state, property.zip].filter(Boolean).join(', ')
    : '—'

  return (
    <div className="p-9 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link to="/clients" className="text-sm text-slate hover:text-yellow no-underline mb-2 inline-block">
            ← All Clients
          </Link>
          <h1 className="font-heading text-2xl font-medium text-white">{name}</h1>
        </div>
        <Link
          to="/touchpoints/compose"
          className="inline-flex items-center justify-center rounded-lg bg-yellow px-5 py-2.5 text-sm font-medium text-navy no-underline hover:bg-gold-light transition-all shrink-0"
        >
          Touchpoint
        </Link>
      </div>

      {saveError && (
        <div className="mb-6 text-sm text-red bg-red/10 border border-red/30 p-3 rounded-lg" role="alert">
          {saveError}
        </div>
      )}

      <div className="space-y-6">
        {/* Contact */}
        <section className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-medium text-white">Contact</h2>
            {editingSection !== 'contact' ? (
              <button
                type="button"
                onClick={() => startEdit('contact', {
                  firstName: homeowner.firstName || '',
                  lastName: homeowner.lastName || '',
                  email: homeowner.email || '',
                  phone: homeowner.phone || '',
                  preferredChannel: homeowner.preferredChannel || 'email',
                })}
                className="text-xs text-yellow hover:text-gold-light"
              >
                Edit
              </button>
            ) : null}
          </div>
          {editingSection === 'contact' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-firstName" className={labelClass}>First name</label>
                  <input id="edit-firstName" type="text" value={editForm.firstName || ''} onChange={(e) => setEditForm((p) => ({ ...p, firstName: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="edit-lastName" className={labelClass}>Last name</label>
                  <input id="edit-lastName" type="text" value={editForm.lastName || ''} onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="edit-email" className={labelClass}>Email</label>
                <input id="edit-email" type="email" value={editForm.email || ''} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label htmlFor="edit-phone" className={labelClass}>Phone</label>
                <input id="edit-phone" type="tel" value={editForm.phone || ''} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label htmlFor="edit-channel" className={labelClass}>Preferred channel</label>
                <select id="edit-channel" value={editForm.preferredChannel || 'email'} onChange={(e) => setEditForm((p) => ({ ...p, preferredChannel: e.target.value }))} className={inputClass}>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={saveContact} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light">Save</button>
                <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate hover:text-yellow">Cancel</button>
              </div>
            </div>
          ) : (
            <dl className="space-y-2 text-sm">
              <div><dt className="text-slate-dim">Email</dt><dd className="text-white">{homeowner.email || '—'}</dd></div>
              <div><dt className="text-slate-dim">Phone</dt><dd className="text-white">{homeowner.phone || '—'}</dd></div>
              <div><dt className="text-slate-dim">Preferred channel</dt><dd className="text-white">{homeowner.preferredChannel || 'email'}</dd></div>
            </dl>
          )}
        </section>

        {/* Property */}
        <section className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-medium text-white">Property</h2>
            {property && editingSection !== 'property' ? (
              <button
                type="button"
                onClick={() => startEdit('property', {
                  addressLine1: property.addressLine1 || '',
                  city: property.city || '',
                  state: property.state || '',
                  zip: property.zip || '',
                })}
                className="text-xs text-yellow hover:text-gold-light"
              >
                Edit
              </button>
            ) : null}
          </div>
          {editingSection === 'property' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-addressLine1" className={labelClass}>Address</label>
                <input id="edit-addressLine1" type="text" value={editForm.addressLine1 || ''} onChange={(e) => setEditForm((p) => ({ ...p, addressLine1: e.target.value }))} className={inputClass} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="edit-city" className={labelClass}>City</label>
                  <input id="edit-city" type="text" value={editForm.city || ''} onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="edit-state" className={labelClass}>State</label>
                  <input id="edit-state" type="text" value={editForm.state || ''} onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="edit-zip" className={labelClass}>Zip</label>
                  <input id="edit-zip" type="text" value={editForm.zip || ''} onChange={(e) => setEditForm((p) => ({ ...p, zip: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={saveProperty} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light">Save</button>
                <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate hover:text-yellow">Cancel</button>
              </div>
            </div>
          ) : (
            <dl className="space-y-2 text-sm">
              <div><dd className="text-white">{address}</dd></div>
              {property?.lastAvmValue != null && (
                <div><dt className="text-slate-dim">AVM value</dt><dd className="text-white">{property.lastAvmValue != null ? `$${Number(property.lastAvmValue).toLocaleString()}` : '—'}</dd></div>
              )}
            </dl>
          )}
        </section>

        {/* Transaction */}
        <section className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-medium text-white">Transaction</h2>
            {transaction && editingSection !== 'transaction' ? (
              <button
                type="button"
                onClick={() => startEdit('transaction', {
                  closingDate: toInputDate(transaction.closingDate),
                  salePrice: transaction.salePrice != null ? String(transaction.salePrice) : '',
                })}
                className="text-xs text-yellow hover:text-gold-light"
              >
                Edit
              </button>
            ) : null}
          </div>
          {editingSection === 'transaction' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-closingDate" className={labelClass}>Closing date</label>
                <input id="edit-closingDate" type="date" value={editForm.closingDate || ''} onChange={(e) => setEditForm((p) => ({ ...p, closingDate: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label htmlFor="edit-salePrice" className={labelClass}>Sale price</label>
                <input id="edit-salePrice" type="number" step="1" min="0" value={editForm.salePrice ?? ''} onChange={(e) => setEditForm((p) => ({ ...p, salePrice: e.target.value }))} placeholder="Optional" className={inputClass} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={saveTransaction} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light">Save</button>
                <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate hover:text-yellow">Cancel</button>
              </div>
            </div>
          ) : (
            <dl className="space-y-2 text-sm">
              <div><dt className="text-slate-dim">Closing date</dt><dd className="text-white">{formatDate(transaction?.closingDate)}</dd></div>
              <div><dt className="text-slate-dim">Sale price</dt><dd className="text-white">{transaction?.salePrice != null ? `$${Number(transaction.salePrice).toLocaleString()}` : '—'}</dd></div>
            </dl>
          )}
        </section>

        {/* Goals */}
        <section className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-medium text-white">Goals</h2>
            {editingSection !== 'goals' ? (
              <button
                type="button"
                onClick={() => startEdit('goals', {
                  goal: homeowner.goals?.type || '',
                  timeframe: homeowner.goals?.timeframe || '',
                })}
                className="text-xs text-yellow hover:text-gold-light"
              >
                Edit
              </button>
            ) : null}
          </div>
          {editingSection === 'goals' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-goal" className={labelClass}>Goal</label>
                <select id="edit-goal" value={editForm.goal || ''} onChange={(e) => setEditForm((p) => ({ ...p, goal: e.target.value }))} className={inputClass}>
                  <option value="">Select a goal</option>
                  {GOAL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={saveGoals} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light">Save</button>
                <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate hover:text-yellow">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white">{homeowner.goals?.type || '—'}</p>
          )}
        </section>

        {/* Notes */}
        <section className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-medium text-white">Notes</h2>
            {editingSection !== 'notes' ? (
              <button
                type="button"
                onClick={() => startEdit('notes', { notes: homeowner.notes || '' })}
                className="text-xs text-yellow hover:text-gold-light"
              >
                {homeowner.notes ? 'Edit' : 'Add'}
              </button>
            ) : null}
          </div>
          {editingSection === 'notes' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-notes" className={labelClass}>Notes</label>
                <textarea id="edit-notes" rows={4} value={editForm.notes || ''} onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Add notes about this client…" className={inputClass} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={saveNotes} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light">Save</button>
                <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate hover:text-yellow">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate whitespace-pre-wrap">{homeowner.notes || '—'}</p>
          )}
        </section>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore'
// addDoc returns a ref; we need the id for property/transaction
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

const GOAL_OPTIONS = [
  'Upgrade (1–3 years)',
  'Upgrade (3–5 years)',
  'Long term',
  'Interested in investment',
  'Undecided',
]

export default function AddHomeowner() {
  const { agentId } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    zip: '',
    closingDate: '',
    goal: '',
  })

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    const { firstName, lastName, addressLine1, closingDate } = form
    if (!firstName?.trim()) return 'First name is required.'
    if (!lastName?.trim()) return 'Last name is required.'
    if (!addressLine1?.trim()) return 'Property address is required.'
    if (!closingDate) return 'Closing date (or year) is required.'
    if (!form.email?.trim() && !form.phone?.trim()) return 'Email or phone is recommended.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setLoading(true)
    try {
      const homeownersRef = collection(db, 'agents', agentId, 'homeowners')
      const homeownerRef = await addDoc(homeownersRef, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        preferredChannel: 'email',
        goals: form.goal ? { type: form.goal, timeframe: '' } : null,
        createdAt: serverTimestamp(),
        lastContactedAt: null,
      })
      const homeownerId = homeownerRef.id

      const propertiesRef = collection(db, 'agents', agentId, 'properties')
      const propertyRef = await addDoc(propertiesRef, {
        homeownerId,
        addressLine1: form.addressLine1.trim(),
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        zip: form.zip.trim() || null,
        lastAvmValue: null,
        lastAvmAt: null,
        avmStatus: 'idle',
        includeInRefresh: true,
        createdAt: serverTimestamp(),
      })

      await addDoc(collection(db, 'agents', agentId, 'transactions'), {
        homeownerId,
        propertyId: propertyRef.id.toString(),
        closingDate: form.closingDate,
        salePrice: null,
      })

      await addDoc(collection(db, 'auditLogs'), {
        agentId,
        homeownerId,
        action: 'homeowner_added',
        payload: { firstName: form.firstName, lastName: form.lastName },
        timestamp: serverTimestamp(),
      })

      navigate('/')
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-navy-light px-3 py-2 text-white placeholder-slate-dim focus:border-gold-dim focus:outline-none'
  const labelClass = 'block text-sm font-medium text-slate'

  return (
    <div className="p-9 max-w-xl">
      <div>
        <h1 className="font-heading text-2xl font-normal text-white">Add client</h1>
        <p className="text-slate mt-1">Single form — the system handles the rest.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-[var(--border)] bg-navy-card p-6 mt-6">
        {error && (
          <p className="text-sm text-red bg-red/10 border border-red/30 p-2 rounded-lg" role="alert">
            {error}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClass}>First name</label>
            <input id="firstName" type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Sarah" className={inputClass} />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Last name</label>
            <input id="lastName" type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Johnson" className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email (optional)</label>
          <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="sarah@example.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone (optional)</label>
          <input id="phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 (303) 555-1212" className={inputClass} />
        </div>
        <div>
          <label htmlFor="addressLine1" className={labelClass}>Property address (required)</label>
          <input id="addressLine1" type="text" value={form.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} placeholder="123 Maple Ave" className={inputClass} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className={labelClass}>City</label>
            <input id="city" type="text" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Denver" className={inputClass} />
          </div>
          <div>
            <label htmlFor="state" className={labelClass}>State</label>
            <input id="state" type="text" value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="CO" className={inputClass} />
          </div>
          <div>
            <label htmlFor="zip" className={labelClass}>Zip</label>
            <input id="zip" type="text" value={form.zip} onChange={(e) => update('zip', e.target.value)} placeholder="80202" className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="closingDate" className={labelClass}>Closing date (or year)</label>
          <input id="closingDate" type="date" value={form.closingDate} onChange={(e) => update('closingDate', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="goal" className={labelClass}>Goal</label>
          <select id="goal" value={form.goal} onChange={(e) => update('goal', e.target.value)} className={inputClass}>
            <option value="">Select a goal</option>
            {GOAL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-50">
            {loading ? 'Adding…' : 'Add client'}
          </button>
          <Link to="/" className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-slate hover:border-gold-dim hover:text-gold no-underline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

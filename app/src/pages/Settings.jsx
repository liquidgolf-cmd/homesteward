import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { useAgentStats } from '@/hooks/useAgentStats'

const cardClass = 'rounded-xl border border-[var(--border)] bg-navy-card p-5'
const labelClass = 'block text-sm font-medium text-slate mb-1'
const inputClass = 'block w-full rounded-lg border border-[var(--border-soft)] bg-navy-light px-3 py-2 text-white placeholder-slate-dim focus:border-gold-dim focus:outline-none'

export default function Settings() {
  const { agentId } = useAuth()
  const { agent, avmUsed, avmQuota } = useAgentStats(agentId)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: agent?.name || '',
    email: agent?.email || '',
    phone: agent?.phone || '',
  })
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)

  const displayName = agent?.name || ''
  const displayEmail = agent?.email || ''
  const displayPhone = agent?.phone || ''

  const startEdit = () => {
    setForm({
      name: displayName || '',
      email: displayEmail || '',
      phone: displayPhone || '',
    })
    setEditing(true)
    setSaveError('')
  }

  const cancelEdit = () => {
    setEditing(false)
    setSaveError('')
  }

  async function handleSave() {
    setSaveError('')
    setSaving(true)
    try {
      await updateDoc(doc(db, 'agents', agentId), {
        name: (form.name || '').trim() || null,
        email: (form.email || '').trim() || null,
        phone: (form.phone || '').trim() || null,
      })
      setEditing(false)
    } catch (err) {
      setSaveError(err.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-9 max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-normal text-white">Settings</h1>
        <p className="text-slate mt-1 text-sm">Manage your profile and subscription.</p>
      </div>

      {/* Profile */}
      <section className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-medium text-white">Profile</h2>
          {!editing ? (
            <button
              type="button"
              onClick={startEdit}
              className="text-xs text-yellow hover:text-gold-light"
            >
              Edit
            </button>
          ) : null}
        </div>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="settings-name" className={labelClass}>Name</label>
              <input
                id="settings-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="settings-email" className={labelClass}>Email</label>
              <input
                id="settings-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="settings-phone" className={labelClass}>Phone</label>
              <input
                id="settings-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className={inputClass}
              />
            </div>
            {saveError && (
              <p className="text-sm text-red" role="alert">{saveError}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate hover:text-yellow disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <dl className="space-y-2 text-sm">
            <div><dt className="text-slate-dim">Name</dt><dd className="text-white">{displayName || '—'}</dd></div>
            <div><dt className="text-slate-dim">Email</dt><dd className="text-white">{displayEmail || '—'}</dd></div>
            <div><dt className="text-slate-dim">Phone</dt><dd className="text-white">{displayPhone || '—'}</dd></div>
          </dl>
        )}
      </section>

      {/* Subscription */}
      <section className={cardClass}>
        <h2 className="font-heading text-lg font-medium text-white mb-4">Subscription</h2>
        <dl className="space-y-2 text-sm">
          <div><dt className="text-slate-dim">Plan</dt><dd className="text-white">{agent?.subscriptionTier || 'Growth Plan'}</dd></div>
          <div>
            <dt className="text-slate-dim">Value updates</dt>
            <dd className="text-white">{avmUsed ?? 0} of {avmQuota ?? 300} this period</dd>
          </div>
        </dl>
        <p className="text-xs text-slate-dim mt-3">Manage billing and add-ons in a future release.</p>
      </section>

      {/* Sign out */}
      <section className={cardClass}>
        <h2 className="font-heading text-lg font-medium text-white mb-4">Account</h2>
        <button
          type="button"
          onClick={() => signOut(auth)}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-slate hover:border-gold-dim hover:text-gold"
        >
          Sign out
        </button>
      </section>
    </div>
  )
}

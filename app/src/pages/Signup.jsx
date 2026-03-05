import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      const agentId = user.uid
      await setDoc(doc(db, 'users', user.uid), { agentId, email, displayName: name })
      const agentRef = doc(db, 'agents', agentId)
      const existing = await getDoc(agentRef)
      if (!existing.exists()) {
        await setDoc(agentRef, {
          name: name || email,
          email,
          subscriptionTier: 'starter',
          avmQuota: 300,
          avmPeriodStart: new Date().toISOString().slice(0, 10),
          avmUsed: 0,
          avmAddonRemaining: 0,
          autoTopupEnabled: false,
          createdAt: new Date().toISOString(),
          preferences: { defaultCadence: 'quarterly' },
        })
      }
      navigate('/')
    } catch (err) {
      setError(err.message || 'Sign up failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm space-y-6">
        <Link to="/" className="block text-center no-underline">
          <span className="font-heading text-2xl font-medium text-gold-light tracking-wide">Home Steward</span>
          <span className="block text-[10px] text-slate tracking-[0.18em] uppercase mt-0.5">Client Relationship OS</span>
        </Link>
        <p className="text-slate text-center text-sm">
          Create your account to get started.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[var(--border)] bg-navy-card p-6">
          {error && (
            <p className="text-sm text-red bg-red/10 border border-red/30 p-2 rounded-lg" role="alert">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-navy-light px-3 py-2 text-white placeholder-slate-dim focus:border-gold-dim focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-navy-light px-3 py-2 text-white placeholder-slate-dim focus:border-gold-dim focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-navy-light px-3 py-2 text-white placeholder-slate-dim focus:border-gold-dim focus:outline-none"
            />
            <p className="mt-0.5 text-xs text-slate-dim">At least 6 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
        <p className="text-center text-sm text-slate">
          Already have an account? <Link to="/login" className="font-medium text-gold-light hover:text-gold no-underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

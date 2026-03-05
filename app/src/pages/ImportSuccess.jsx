import { Link, useLocation } from 'react-router-dom'

export default function ImportSuccess() {
  const location = useLocation()
  const state = location.state || {}
  const count = state.count ?? 0
  const entering57 = state.entering57 ?? 0

  return (
    <div className="p-9 max-w-xl mx-auto text-center">
      <div className="rounded-xl border border-[var(--border)] bg-navy-card p-8">
        <h1 className="font-heading text-2xl font-normal text-white">
          All set. Your database is organized.
        </h1>
        <p className="text-slate mt-3">
          {count} households under care
          {entering57 > 0 ? ` — ${entering57} entering 5–7 year window` : ''}
        </p>
        <Link
          to="/touchpoints"
          className="mt-6 inline-block rounded-lg bg-gold px-5 py-3 text-sm font-medium text-navy hover:bg-gold-light no-underline"
        >
          Go to touchpoints
        </Link>
        <p className="text-xs text-slate-dim mt-6">
          We suggested quarterly cadence by default. You can adjust this in Settings.
        </p>
      </div>
    </div>
  )
}

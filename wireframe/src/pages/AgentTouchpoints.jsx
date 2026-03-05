import { Link } from 'react-router-dom'
import { useState } from 'react'

const FILTERS = ['All', 'Priority', 'New', 'RSVP']

const TOUCHPOINTS = [
  { name: 'Sarah Johnson', reason: '5-year ownership', tag: 'Equity +12%' },
  { name: 'Mike Torres', reason: '7-year ownership', tag: 'Milestone' },
  { name: 'Jamie Lee', reason: 'Quarterly check-in', tag: '—' },
]

export default function AgentTouchpoints() {
  const [filter, setFilter] = useState('All')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          This quarter — meaningful touchpoints
        </h1>
        <p className="text-slate-600 mt-1">Suggested messages — you choose to send or dismiss.</p>
      </div>

      {/* Filter pills — conversation 2 */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              filter === f
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Touchpoint cards — conversation 2: ClientName, ShortReason, TagLabel, Review & send */}
      <div className="space-y-4">
        {TOUCHPOINTS.map((t, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="font-medium text-slate-900">{t.name}</p>
            <p className="text-sm text-slate-600 mt-0.5">{t.reason}</p>
            {t.tag !== '—' && (
              <span className="inline-block mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {t.tag}
              </span>
            )}
            <div className="mt-4">
              <Link
                to="/touchpoints/compose"
                className="inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Review & send
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-500">
        <Link to="/" className="underline hover:text-slate-700">Back to dashboard</Link>
      </p>
    </div>
  )
}

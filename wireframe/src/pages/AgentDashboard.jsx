import { Link } from 'react-router-dom'

const QUICK_ACTIONS = [
  { to: '/add-homeowner', label: '+ Add client' },
  { to: '/import', label: 'Import' },
  { to: '/create-event', label: 'Create event' },
  { to: '#', label: 'Settings' },
]

const TOUCHPOINTS_PREVIEW = [
  { name: 'Sarah Johnson', reason: '5-year ownership', tag: 'Equity +12%' },
  { name: 'Mike Torres', reason: '7-year ownership', tag: 'Milestone' },
]

export default function AgentDashboard() {
  return (
    <div className="space-y-8">
      {/* Hero card — conversation 2 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-3xl font-semibold text-slate-900">187 households under care</p>
        <p className="text-slate-600 mt-1">
          4 meaningful touchpoints this month — 3 priority triggers
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/touchpoints"
            className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Review this month
          </Link>
          <Link
            to="/add-homeowner"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Add client
          </Link>
        </div>
      </div>

      {/* Quick actions — conversation 2 */}
      <div className="flex flex-wrap gap-2 text-sm">
        {QUICK_ACTIONS.map(({ to, label }) => (
          <Link
            key={label}
            to={to}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Touchpoints preview — conversation 2 */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-medium text-slate-900">This quarter — meaningful touchpoints</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {TOUCHPOINTS_PREVIEW.map((t, i) => (
            <li key={i} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium text-slate-800">{t.name}</p>
                <p className="text-sm text-slate-500">{t.reason}</p>
                <span className="inline-block mt-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {t.tag}
                </span>
              </div>
              <Link
                to="/touchpoints/compose"
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
              >
                Review & send
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Property Value Updates compact card — conversation 2 */}
      <Link
        to="/avm-meter"
        className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors"
      >
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Property value updates
        </p>
        <p className="text-slate-800 mt-1">142 of 300 updates used this month</p>
        <p className="text-xs text-slate-400 mt-0.5">Tap to view details</p>
        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-[47%] bg-emerald-500 rounded-full" />
        </div>
      </Link>
    </div>
  )
}

import { Link } from 'react-router-dom'

export default function HomeownerPortal() {
  return (
    <div className="space-y-8 max-w-xl">
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xl font-medium">
          J
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Your Home Dashboard from your agent</h1>
          <p className="text-sm text-slate-500">Homeowner portal (Phase 2)</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-900">Home snapshot</h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-sm text-slate-500">Estimated value</dt>
            <dd className="text-lg font-medium text-slate-800">—</dd>
            <dd className="text-xs text-slate-400">Value updates coming in Phase 3</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Equity estimate</dt>
            <dd className="text-lg font-medium text-slate-800">—</dd>
          </div>
        </dl>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-900">Seasonal home reminders</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>· Time to service HVAC</li>
          <li>· Winterize irrigation</li>
          <li>· Tax assessment review window open</li>
        </ul>
      </div>
      <p className="text-sm text-slate-500">
        <Link to="/" className="underline hover:text-slate-700">← Back to dashboard</Link>
      </p>
    </div>
  )
}

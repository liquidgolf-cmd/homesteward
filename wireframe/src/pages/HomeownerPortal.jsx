import { Link } from 'react-router-dom'

export default function HomeownerPortal() {
  return (
    <div className="space-y-8 max-w-xl">
      {/* Agent as hero - invisible infrastructure */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xl font-medium">
          J
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Your Home Dashboard from Jane Smith</h1>
          <p className="text-sm text-slate-500">Your agent · (555) 123-4567</p>
        </div>
      </div>

      {/* Home snapshot */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-900">Home snapshot</h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-sm text-slate-500">Estimated value</dt>
            <dd className="text-lg font-medium text-slate-800">—</dd>
            <dd className="text-xs text-slate-400">Value updates coming soon</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Equity estimate</dt>
            <dd className="text-lg font-medium text-slate-800">—</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Neighborhood activity</dt>
            <dd className="text-sm text-slate-600">A few homes sold nearby this quarter. I can run a quick value check if you’re curious.</dd>
          </div>
        </dl>
      </div>

      {/* Seasonal reminders */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-900">Seasonal home reminders</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>· Time to service HVAC</li>
          <li>· Winterize irrigation</li>
          <li>· Tax assessment review window open</li>
        </ul>
      </div>

      {/* Annual review */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-900">Annual home review</h2>
        <p className="text-sm text-slate-600 mt-2">
          12-month value change, local sales context, and equity position — plus an optional call to discuss.
        </p>
        <button className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Schedule a call with Jane
        </button>
      </div>

      {/* Optional actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-900">Need something?</h2>
        <p className="text-sm text-slate-600 mt-1">Reach out anytime — no pressure.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Request updated value
          </button>
          <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Ask my agent a question
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        <Link to="/" className="underline hover:text-slate-700">← Back to wireframe nav</Link>
      </p>
    </div>
  )
}

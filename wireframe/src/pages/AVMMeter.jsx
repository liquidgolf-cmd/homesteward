import { Link } from 'react-router-dom'

export default function AVMMeter() {
  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Property value update usage</h1>
        <p className="text-slate-600 mt-1">
          We refresh home values quarterly by default to keep your data current without unnecessary costs.
        </p>
      </div>

      {/* Primary meter — conversation 2 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
        <p className="text-2xl font-semibold text-slate-900">142 / 300 updates used</p>
        <p className="text-sm text-slate-500 mt-1">Estimated cost: $14.20</p>
        <div className="mt-4 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-[47%] bg-emerald-500 rounded-full" />
        </div>
      </div>

      {/* Breakdown — conversation 2 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-900">This month's activity</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>Automatic quarterly refresh — 120</li>
          <li>On-demand checks — 18</li>
          <li>Import enrichment — 4</li>
        </ul>
      </div>

      {/* Actions — conversation 2 */}
      <div className="space-y-3">
        <button
          type="button"
          className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Purchase add-on
        </button>
        <button
          type="button"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Change refresh cadence
        </button>
        <div className="flex items-center justify-between pt-2">
          <label htmlFor="pause-avm" className="text-sm text-slate-700">
            Pause value refresh
          </label>
          <input id="pause-avm" type="checkbox" className="rounded border-slate-300" />
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Only successful updates count toward your total. Meter resets on Apr 1.
      </p>

      <Link
        to="/"
        className="inline-block rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

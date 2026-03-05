import { Link } from 'react-router-dom'

export default function PostImportSuccess() {
  return (
    <div className="space-y-8 max-w-xl mx-auto text-center pt-12">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          All set. Your database is organized.
        </h1>
        <p className="text-slate-600 mt-3">
          187 households under care — 22 entering 5–7 year window
        </p>
        <Link
          to="/touchpoints"
          className="mt-6 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
        >
          Go to touchpoints
        </Link>
        <p className="text-xs text-slate-500 mt-6">
          We suggested quarterly cadence by default. You can adjust this in Settings.
        </p>
      </div>
    </div>
  )
}

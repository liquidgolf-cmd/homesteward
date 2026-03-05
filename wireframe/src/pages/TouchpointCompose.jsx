import { Link } from 'react-router-dom'

const PREFILL = `Quick note from Mike — homes near 123 Maple Ave saw a small uptick this quarter. If you're curious what that means for yours, I'm happy to run a quick look — no pressure. —Mike`

export default function TouchpointCompose() {
  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Review & send</h1>
        <p className="text-slate-600 mt-1">Edit the message below, then choose how to send.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <label className="block text-sm font-medium text-slate-700">Message</label>
        <textarea
          rows={6}
          defaultValue={PREFILL}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="Write a short, helpful note. Keep it personal and calm."
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Send via</label>
          <div className="flex gap-2">
            {['Push (recommended)', 'Email', 'SMS'].map((ch) => (
              <label key={ch} className="flex items-center gap-2">
                <input type="radio" name="channel" defaultChecked={ch === 'Push (recommended)'} />
                <span className="text-sm text-slate-700">{ch}</span>
              </label>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          This message will appear from you and include an optional "Learn more" link.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Send message
          </button>
          <Link
            to="/touchpoints"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

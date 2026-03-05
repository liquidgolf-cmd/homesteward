import { Link } from 'react-router-dom'

export default function EventCreator() {
  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Host client event</h1>
        <p className="text-slate-600 mt-1">Invite past clients — keep events occasional to maintain trust.</p>
      </div>

      <form className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            placeholder="e.g. Summer open house & market update"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Date & time</label>
          <input
            type="datetime-local"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Location (optional)</label>
          <input
            type="text"
            placeholder="Address or venue"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Note (optional)</label>
          <textarea
            rows={2}
            placeholder="Brief description for the invite"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Upload flyer</label>
          <button
            type="button"
            className="mt-1 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:bg-slate-50"
          >
            Choose file (JPG/PNG)
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Audience</label>
          <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
            <option>All past clients</option>
            <option>Tagged segment</option>
            <option>Custom select</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="rsvp" defaultChecked />
          <label htmlFor="rsvp" className="text-sm text-slate-700">Enable RSVP</label>
        </div>
        <p className="text-xs text-slate-500">
          This invitation will be sent from you. Keep events occasional to maintain trust.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Send invite
          </button>
          <Link
            to="/"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

import { Link } from 'react-router-dom'

const GOAL_OPTIONS = [
  'Upgrade (1–3 years)',
  'Upgrade (3–5 years)',
  'Long term',
  'Interested in investment',
  'Undecided',
]

export default function AgentAddHomeowner() {
  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Add client</h1>
        <p className="text-slate-600 mt-1">Single form — the system handles the rest.</p>
      </div>

      <form className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">First name</label>
            <input
              type="text"
              placeholder="Sarah"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Last name</label>
            <input
              type="text"
              placeholder="Johnson"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email (optional)</label>
          <input
            type="email"
            placeholder="sarah@example.com"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Phone (optional)</label>
          <input
            type="tel"
            placeholder="+1 (303) 555-1212"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Property address (required)</label>
          <input
            type="text"
            placeholder="123 Maple Ave"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">City</label>
            <input
              type="text"
              placeholder="Denver"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">State</label>
            <input
              type="text"
              placeholder="CO"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Zip</label>
            <input
              type="text"
              placeholder="80202"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Closing date (or year)</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Goal</label>
          <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
            <option value="">Select a goal</option>
            {GOAL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Add client
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

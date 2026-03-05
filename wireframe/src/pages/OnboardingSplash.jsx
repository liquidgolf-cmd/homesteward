import { Link } from 'react-router-dom'

export default function OnboardingSplash() {
  return (
    <div className="space-y-8 max-w-xl mx-auto text-center pt-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome — let's get your client portfolio organized.
        </h1>
        <p className="text-slate-600 mt-3">
          Upload your contacts and we'll tidy them up. Fast. Private. Agent-branded.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/import"
          className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
        >
          Upload contacts (CSV)
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Import from CRM (optional)
        </Link>
      </div>

      <p className="text-sm text-slate-500">
        Need help?{' '}
        <span className="underline cursor-pointer hover:text-slate-700">Concierge import</span>
        {' '}— one-time fee
      </p>
    </div>
  )
}

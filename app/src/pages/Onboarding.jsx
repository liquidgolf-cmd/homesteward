import { Link } from 'react-router-dom'

export default function Onboarding() {
  return (
    <div className="p-9 max-w-xl mx-auto text-center">
      <div>
        <h1 className="font-heading text-2xl font-normal text-white">
          Welcome — let's get your client portfolio organized.
        </h1>
        <p className="text-slate mt-3">
          Upload your contacts and we'll tidy them up. Fast. Private. Agent-branded.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Link to="/import" className="rounded-lg bg-gold px-5 py-3 text-sm font-medium text-navy hover:bg-gold-light no-underline">
          Upload contacts (CSV)
        </Link>
        <Link to="/" className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-medium text-slate hover:border-gold-dim hover:text-gold no-underline">
          Import from CRM (optional)
        </Link>
      </div>
      <p className="text-sm text-slate mt-4">
        Need help? <span className="text-gold-light cursor-pointer hover:text-gold">Concierge import</span> — one-time fee
      </p>
    </div>
  )
}

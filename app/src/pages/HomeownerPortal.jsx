export default function HomeownerPortal() {
  return (
    <div className="min-h-screen bg-[#f5f3ef] text-[#0b1522]">
      <div className="max-w-lg mx-auto px-6 py-12 space-y-8">
        <header className="flex items-center gap-4 rounded-2xl border border-[rgba(11,21,34,0.08)] bg-white p-6 shadow-sm">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#8a6d2e] to-[#c9a84c] flex items-center justify-center text-white text-xl font-semibold">
            H
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#0b1522]">Your home snapshot</h1>
            <p className="text-sm text-[#3d556a]">From your real estate agent</p>
          </div>
        </header>

        <section className="rounded-2xl border border-[rgba(11,21,34,0.08)] bg-white p-6 shadow-sm">
          <h2 className="font-medium text-[#0b1522]">Property overview</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm text-[#3d556a]">Estimated value</dt>
              <dd className="text-lg font-medium text-[#0b1522]">—</dd>
              <dd className="text-xs text-[#7a90a8] mt-0.5">Value updates coming in Phase 3</dd>
            </div>
            <div>
              <dt className="text-sm text-[#3d556a]">Equity</dt>
              <dd className="text-lg font-medium text-[#0b1522]">—</dd>
              <dd className="text-xs text-[#7a90a8] mt-0.5">Value updates coming in Phase 3</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[rgba(11,21,34,0.08)] bg-white p-6 shadow-sm">
          <h2 className="font-medium text-[#0b1522]">Seasonal home reminders</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#3d556a]">
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c]">·</span>
              Time to service HVAC
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c]">·</span>
              Winterize irrigation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c]">·</span>
              Tax assessment review window open
            </li>
          </ul>
        </section>

        <p className="text-sm text-[#3d556a] text-center">
          Questions? <a href="mailto:agent@example.com" className="text-[#c9a84c] hover:text-[#8a6d2e] underline">Contact your agent</a>
        </p>
      </div>
    </div>
  )
}

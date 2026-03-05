import { Outlet, Link, useLocation } from 'react-router-dom'

const AGENT_NAME = 'Mike Smith'
const UNDER_CARE = 187
const AVM_USED = 142
const AVM_QUOTA = 300

const nav = [
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/', label: 'Dashboard' },
  { to: '/touchpoints', label: 'Touchpoints' },
  { to: '/avm-meter', label: 'Property value updates' },
  { to: '/add-homeowner', label: 'Add client' },
  { to: '/import', label: 'Import mapping' },
  { to: '/create-event', label: 'Create event' },
  { to: '/homeowner', label: 'Homeowner portal' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <span className="text-sm font-medium text-slate-700">{AGENT_NAME} — Under care: {UNDER_CARE}</span>
          <nav className="flex gap-2 flex-wrap items-center">
            <Link
              to="/avm-meter"
              className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1 rounded bg-slate-100"
              title="Property value updates"
            >
              Property value updates {AVM_USED} / {AVM_QUOTA}
            </Link>
            {nav.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  location.pathname === to
                    ? 'bg-slate-200 text-slate-800 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

import { Link } from 'react-router-dom'

const TABS = [
  { id: 'marketing', label: 'Marketing Site' },
  { id: 'dashboard', label: 'Dashboard', suffix: 'APP' },
  { id: 'import', label: 'Import Flow', suffix: 'APP' },
  { id: 'compose', label: 'Touchpoint Compose', suffix: 'APP' },
]

export default function PrototypeTopBar({ activeTab, onTabChange }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 py-3 bg-[rgba(8,14,22,0.98)] border-b border-[rgba(201,168,76,0.2)] flex-wrap">
      <div className="flex items-center gap-3">
        <span className="font-heading text-base font-medium text-yellow tracking-wide whitespace-nowrap">
          Home Steward
        </span>
        <span className="w-px h-4 bg-slate-dim shrink-0" />
        <span className="text-[10px] tracking-[0.18em] uppercase text-slate font-normal">Interactive Prototype</span>
      </div>

      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap border ${
              activeTab === tab.id
                ? 'bg-yellow border-yellow text-navy'
                : 'border-transparent text-slate hover:bg-white/5 hover:text-white-dim'
            }`}
          >
            {tab.label}
            {tab.suffix && <span className="ml-1 text-[8px] bg-gold text-navy px-1 rounded font-semibold">{tab.suffix}</span>}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <a href="#features" className="text-xs text-slate no-underline hover:text-white">Features</a>
        <a href="#how" className="text-xs text-slate no-underline hover:text-white">How It Works</a>
        <a href="#pricing" className="text-xs text-slate no-underline hover:text-white">Pricing</a>
        <a href="#faq" className="text-xs text-slate no-underline hover:text-white">FAQ</a>
        <Link to="/login" className="text-xs text-white-dim no-underline hover:text-white">Sign in</Link>
        <Link
          to="/signup"
          className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-navy no-underline hover:bg-gold-light"
        >
          Start your pilot
        </Link>
        <span className="text-[9px] text-slate-dim tracking-wider uppercase hidden sm:inline">Click tabs to switch screens</span>
      </div>
    </header>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { useAgentStats } from '@/hooks/useAgentStats'

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: '⌂', label: 'Dashboard' },
      { to: '/touchpoints', icon: '◈', label: 'Touchpoints', badge: 'touchpointCount' },
      { to: '/triggers', icon: '◉', label: 'Triggers', badge: 'triggers' },
    ],
  },
  {
    label: 'Clients',
    items: [
      { to: '/clients', icon: '⊞', label: 'All Clients' },
      { to: '/import', icon: '↑', label: 'Import' },
      { to: '/create-event', icon: '◎', label: 'Events' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/equity-map', icon: '≋', label: 'Equity Map' },
      { to: '/avm-meter', icon: '⊗', label: 'Property Values' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/settings', icon: '◇', label: 'Settings' },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, agentId } = useAuth()
  const { agent, touchpointCount } = useAgentStats(agentId)

  const displayName = agent?.name || user?.email?.split('@')[0] || 'Agent'
  const initials = displayName
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const tier = agent?.subscriptionTier || 'Growth Plan'

  return (
    <aside className="flex flex-col w-[240px] shrink-0 h-full bg-navy-mid border-r border-[var(--border)] overflow-hidden">
      <div className="px-6 pt-7 pb-6 border-b border-[var(--border)]">
        <div className="font-heading text-[22px] font-medium tracking-wide text-white leading-tight">
          Home Steward
        </div>
        <div className="text-[10px] tracking-[0.18em] uppercase text-slate mt-1">
          CLIENT RELATIONSHIP OS
        </div>
      </div>

      <div className="mx-3 my-4 p-3.5 rounded-xl bg-navy-light border border-[var(--border)] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-dim to-gold flex items-center justify-center font-heading text-base font-semibold text-navy shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-white truncate">{displayName}</div>
          <div className="text-[10px] tracking-[0.12em] uppercase text-gold mt-0.5">{tier}</div>
        </div>
      </div>

      <nav className="flex-1 py-2 px-3 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label} className="pt-4 pb-1.5">
            <div className="text-[9px] tracking-[0.2em] uppercase text-slate-dim px-3 font-normal">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/'))
              const badge = item.badge === 'touchpointCount' ? touchpointCount : null
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg transition-all text-[13.5px] font-light no-underline relative ${
                    isActive
                      ? 'bg-[var(--gold-glow)] text-gold-light font-medium border border-[rgba(201,168,76,0.2)] [&::before]:content-[""] [&::before]:absolute [&::before]:left-0 [&::before]:top-1/4 [&::before]:bottom-1/4 [&::before]:w-0.5 [&::before]:bg-gold [&::before]:rounded-sm'
                      : 'text-slate hover:bg-navy-hover hover:text-white-dim'
                  }`}
                >
                  <span className="w-4 text-center text-sm shrink-0">{item.icon}</span>
                  <span className="flex-1 min-w-0 truncate">{item.label}</span>
                  {badge != null && badge > 0 && (
                    <span className="ml-auto bg-gold text-navy text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="py-4 px-6 border-t border-[var(--border)] flex flex-wrap justify-between items-center gap-2 text-[11px] text-slate-dim">
        <div className="flex gap-4">
          <a href="/privacy" className="text-slate-dim no-underline hover:text-gold">Privacy</a>
          <a href="/help" className="text-slate-dim no-underline hover:text-gold">Help</a>
          <a href="/terms" className="text-slate-dim no-underline hover:text-gold">Terms</a>
        </div>
        <button type="button" onClick={() => signOut(auth)} className="text-slate-dim hover:text-gold bg-transparent border-0 cursor-pointer text-[11px]">
          Sign out
        </button>
      </div>
    </aside>
  )
}

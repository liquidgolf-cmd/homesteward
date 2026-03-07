import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const PREFILL = `Quick note — homes near your area saw a small uptick this quarter. If you're curious what that means for yours, I'm happy to run a quick look — no pressure.`

// AI variations pool — tone-keyed templates (mock generation; no API)
const AI_VARIATIONS = {
  warm: [
    `Quick note — homes near your area saw a small uptick this quarter. If you're curious what that means for yours, I'm happy to run a quick look — no pressure.`,
    `Hope you're doing well! I noticed some movement in your neighborhood recently. Would love to catch up and share what it could mean for your home — totally no obligation.`,
    `Just thinking of you — your area has been busy lately. If you'd like a quick snapshot of how your home stacks up, I'm here. No strings attached.`,
    `Hi there! Neighborhood activity picked up this quarter. I'd be happy to run the numbers for you if you're curious — zero pressure, just helpful info.`,
    `Wanted to reach out — there's been some action near you. Happy to give you a quick read on your property whenever you'd like.`,
  ],
  direct: [
    `Neighborhood activity up this quarter. Your property may be affected. Happy to run a value check — reply if interested.`,
    `Homes in your area: small uptick in activity. I can pull a quick valuation. Let me know.`,
    `Market update for your neighborhood: movement this quarter. Want a value snapshot? Reply yes.`,
  ],
  brief: [
    `Neighborhood uptick — want a quick value look? No pressure.`,
    `Homes near you moving. Quick check available if you're curious.`,
    `Area activity up. Happy to run numbers. LMK.`,
  ],
}

const client = {
  name: 'Sarah Johnson',
  address: '423 Birchwood Ln\nDenver, CO 80206',
  initials: 'SJ',
  tags: [
    { label: '5-Year Milestone', type: 'gold' },
    { label: 'Equity +12%', type: 'green' },
    { label: 'Move Window', type: 'amber' },
  ],
  homeValue: '$638K',
  equity: '$184K',
  closingDate: 'Jun 2019',
  yearsOwned: '6.7 yrs',
  goalType: 'Upgrade in 3–5 years',
  goalText: '"Would love a bigger kitchen and a yard for the dog. Not in a rush — watching the market."',
  trigger: '3 homes sold on her block in the last 30 days. Equity crossed 30% threshold. Ownership year 5–7 window — historically highest move-intent period.',
}

function pickVariations(pool, count = 3) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function TouchpointCompose() {
  const { user } = useAuth()
  const [message, setMessage] = useState(PREFILL)
  const [channel, setChannel] = useState('push')
  const [tone, setTone] = useState('warm')
  const [includeLink, setIncludeLink] = useState(true)
  const [sent, setSent] = useState(false)
  const [aiVariations, setAiVariations] = useState(() => pickVariations(AI_VARIATIONS.warm))
  const [regenerating, setRegenerating] = useState(false)
  const [previewOverride, setPreviewOverride] = useState(null)

  const agentName = user?.displayName || 'Mike Smith'
  const previewText = previewOverride ?? message

  const handleRegenerate = useCallback(() => {
    setRegenerating(true)
    setTimeout(() => {
      setAiVariations(pickVariations(AI_VARIATIONS[tone]))
      setRegenerating(false)
    }, 500)
  }, [tone])

  // When tone changes, refresh variations
  const handleToneChange = (t) => {
    setTone(t)
    setAiVariations(pickVariations(AI_VARIATIONS[t]))
  }

  const handleUseVariation = (text) => {
    setPreviewOverride(text)
  }

  const handleSend = () => {
    setSent(true)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewText)
    } catch {}
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Topbar: back + breadcrumb + queue pill */}
      <div className="flex items-center justify-between px-9 py-4 border-b border-[var(--border-soft)] shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/touchpoints" className="text-slate hover:text-white-dim no-underline flex items-center gap-1">
            <span className="opacity-80">←</span> Touchpoints
          </Link>
          <span className="text-slate-dim">/</span>
          <span className="text-slate">This Quarter</span>
          <span className="text-slate-dim">/</span>
          <span className="text-white font-medium">{client.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-card border border-[var(--border)] text-xs text-slate">
            Touchpoint <span className="font-medium text-gold-light">1</span> of 7
          </div>
          <button type="button" className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center text-slate hover:bg-navy-hover" aria-label="Previous">‹</button>
          <button type="button" className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center text-slate hover:bg-navy-hover" aria-label="Next">›</button>
        </div>
      </div>

      {/* Three panels */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Client context */}
        <div className="w-[320px] shrink-0 border-r border-[var(--border-soft)] overflow-y-auto p-6 space-y-6">
          <div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-dim to-gold flex items-center justify-center font-heading text-xl font-semibold text-navy mb-3">
              {client.initials}
            </div>
            <div className="font-heading text-lg font-medium text-white">{client.name}</div>
            <div className="text-xs text-slate mt-1 whitespace-pre-line">{client.address}</div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {client.tags.map((t) => (
                <span
                  key={t.label}
                  className={`px-2 py-0.5 rounded text-[10px] border ${
                    t.type === 'gold'
                      ? 'bg-[var(--gold-glow)] text-gold border-[rgba(201,168,76,0.2)]'
                      : t.type === 'green'
                        ? 'bg-[rgba(62,180,137,0.12)] text-green border-[rgba(62,180,137,0.2)]'
                        : 'bg-[rgba(212,146,74,0.12)] text-amber border-[rgba(212,146,74,0.2)]'
                  }`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-wider uppercase text-slate-dim mb-2">Property Intelligence</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-navy-card border border-[var(--border-soft)] p-2.5">
                <div className="text-sm font-medium text-white-dim">{client.homeValue}</div>
                <div className="text-[10px] text-slate">Est. home value</div>
              </div>
              <div className="rounded-lg bg-navy-card border border-[var(--border-soft)] p-2.5">
                <div className="text-sm font-medium text-green">{client.equity}</div>
                <div className="text-[10px] text-slate">Equity position</div>
              </div>
              <div className="rounded-lg bg-navy-card border border-[var(--border-soft)] p-2.5">
                <div className="text-sm font-medium text-white-dim">{client.closingDate}</div>
                <div className="text-[10px] text-slate">Closing date</div>
              </div>
              <div className="rounded-lg bg-navy-card border border-[var(--border-soft)] p-2.5">
                <div className="text-sm font-medium text-amber">{client.yearsOwned}</div>
                <div className="text-[10px] text-slate">Years owned</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-wider uppercase text-slate-dim mb-2">Client Goal</div>
            <div className="rounded-lg bg-navy-card border border-[var(--border-soft)] p-3">
              <div className="text-[13px] font-medium text-white">{client.goalType}</div>
              <div className="text-xs text-slate mt-1">{client.goalText}</div>
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-wider uppercase text-slate-dim mb-2">Why This Touchpoint</div>
            <div className="rounded-lg bg-navy-card border border-[var(--border-soft)] p-3 text-[12px] text-slate leading-relaxed">
              {client.trigger}
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-wider uppercase text-slate-dim mb-2">Contact History</div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                <div>
                  <div className="text-[12px] text-white-dim">Today — This touchpoint</div>
                  <div className="text-[10px] text-slate-dim">Pending your review</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-green shrink-0 mt-1.5" />
                <div>
                  <div className="text-[12px] text-white-dim">Q3 2025 Check-in sent</div>
                  <div className="text-[10px] text-slate-dim">Sep 12, 2025</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-dim shrink-0 mt-1.5" />
                <div>
                  <div className="text-[12px] text-white-dim">Closed — 423 Birchwood Ln</div>
                  <div className="text-[10px] text-slate-dim">Jun 12, 2019</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Compose */}
        <div className="flex-1 min-w-0 overflow-y-auto p-6">
          <div className="max-w-xl">
            <div className="text-[10px] tracking-wider uppercase text-gold mb-1">Review & Send</div>
            <h1 className="font-heading text-2xl font-normal text-white mb-1">Message for {client.name}</h1>
            <p className="text-sm text-slate mb-5">Edit freely — this message appears to come directly from you.</p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs text-slate-dim">Send via</span>
              {[
                { id: 'push', icon: '🔔', label: 'Push' },
                { id: 'sms', icon: '💬', label: 'SMS' },
                { id: 'email', icon: '✉', label: 'Email' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChannel(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-colors ${
                    channel === c.id
                      ? 'bg-[var(--gold-glow)] border-[rgba(201,168,76,0.25)] text-gold-light'
                      : 'border-[var(--border-soft)] text-slate hover:bg-navy-hover'
                  }`}
                >
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
              <span className="w-px h-4 bg-[var(--border-soft)]" />
              <span className="text-xs text-slate-dim">Tone</span>
              {['warm', 'direct', 'brief'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleToneChange(t)}
                  className={`px-3 py-1.5 rounded-lg border text-xs capitalize transition-colors ${
                    tone === t
                      ? 'bg-[var(--gold-glow)] border-[rgba(201,168,76,0.25)] text-gold-light'
                      : 'border-[var(--border-soft)] text-slate hover:bg-navy-hover'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="rounded-lg bg-navy-card border border-[var(--border-soft)] px-3 py-2 mb-4 flex items-center gap-2 text-xs text-slate">
              <span>⚡</span>
              <span>Triggered by <strong className="text-white-dim">neighborhood activity + 5-yr milestone</strong></span>
              <span className="ml-auto px-2 py-0.5 rounded bg-[var(--gold-glow)] text-gold text-[10px]">High priority</span>
            </div>

            <div className="rounded-xl bg-navy-card border border-[var(--border)] p-4 mb-4">
              <div className="flex justify-between text-[11px] text-slate-dim mb-2">
                <span>From <span className="text-white-dim">{agentName}</span></span>
                <span>To: <span className="text-white-dim">{client.name}</span></span>
              </div>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setPreviewOverride(null)
                }}
                className="w-full rounded-lg bg-navy-light border border-[var(--border-soft)] px-3 py-2.5 text-sm text-white placeholder-slate-dim focus:border-gold-dim focus:outline-none resize-y min-h-[120px]"
                placeholder="Write a short, helpful note."
              />
              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-dim">
                <span>{message.length} characters</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span>Include "Learn more" link</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={includeLink}
                    onClick={() => setIncludeLink(!includeLink)}
                    className={`w-9 h-5 rounded-full border transition-colors relative ${
                      includeLink ? 'bg-gold border-gold-dim' : 'bg-navy-light border-[var(--border-soft)]'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${includeLink ? 'left-4' : 'left-0.5'}`} />
                  </button>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-dim">AI Variations</span>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="text-xs text-gold hover:text-gold-light disabled:opacity-50 flex items-center gap-1"
                >
                  {regenerating ? '…' : '↻'} Regenerate
                </button>
              </div>
              <div className="space-y-2">
                {aiVariations.map((v, i) => (
                  <button
                    key={`${i}-${v.slice(0, 30)}`}
                    type="button"
                    onClick={() => handleUseVariation(v)}
                    className="block w-full text-left rounded-lg bg-navy-card border border-[var(--border-soft)] px-3 py-2.5 text-[13px] text-slate hover:border-gold-dim hover:text-white-dim transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-dim mt-2">Click a variation to see it in Live Preview.</p>
            </div>
          </div>
        </div>

        {/* Right: Live Preview + Review & Send */}
        <div className="w-[300px] shrink-0 border-l border-[var(--border-soft)] p-4 overflow-y-auto flex flex-col gap-4">
          <div>
            <div className="text-[10px] tracking-wider uppercase text-slate-dim mb-2">Live Preview</div>
            <div className="text-xs text-slate mb-2">{channel === 'push' ? 'Push Notification' : channel === 'sms' ? 'SMS' : 'Email'}</div>
            <div className="rounded-xl bg-navy-card border border-[var(--border)] p-4">
              <div className="text-xs text-white-dim font-medium mb-1">{agentName}</div>
              <div className="text-[11px] text-slate line-clamp-3">{previewText.slice(0, 120)}{previewText.length > 120 ? '…' : ''}</div>
              {includeLink && <div className="mt-2 text-[10px] text-gold" title="Link to personalized value report (mockup)">Learn more</div>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSend}
              className="rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-navy hover:bg-gold-light w-full"
            >
              Send message
            </button>
            <Link
              to="/touchpoints"
              className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-slate hover:border-gold-dim hover:text-gold no-underline text-center"
            >
              Dismiss
            </Link>
          </div>
          {sent && (
            <div className="text-sm bg-amber/10 border border-amber/30 p-3 rounded-lg space-y-2">
              <p className="text-amber text-xs">No real delivery — copy and send yourself.</p>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light w-full"
              >
                Copy to clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

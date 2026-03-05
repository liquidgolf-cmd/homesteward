import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function EventCreator() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass = 'mt-1 block w-full rounded-lg border border-[var(--border-soft)] bg-navy-light px-3 py-2 text-white placeholder-slate-dim focus:border-gold-dim focus:outline-none'

  return (
    <div className="p-9 max-w-xl">
      <div>
        <h1 className="font-heading text-2xl font-normal text-white">Host client event</h1>
        <p className="text-slate mt-1">Invite past clients — keep events occasional to maintain trust.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-[var(--border)] bg-navy-card p-6 mt-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate">Title</label>
          <input id="title" type="text" placeholder="e.g. Summer open house & market update" className={inputClass} />
        </div>
        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-slate">Date & time</label>
          <input id="datetime" type="datetime-local" className={inputClass} />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate">Location (optional)</label>
          <input id="location" type="text" placeholder="Address or venue" className={inputClass} />
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-slate">Note (optional)</label>
          <textarea id="note" rows={2} placeholder="Brief description for the invite" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate">Upload flyer</label>
          <button
            type="button"
            className="mt-1 rounded-lg border border-dashed border-slate-dim px-4 py-3 text-sm text-slate hover:bg-navy-hover"
          >
            Choose file (JPG/PNG)
          </button>
        </div>
        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-slate">Audience</label>
          <select id="audience" className={inputClass}>
            <option>All past clients</option>
            <option>Tagged segment</option>
            <option>Custom select</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="rsvp" defaultChecked className="rounded border-slate-dim" />
          <label htmlFor="rsvp" className="text-sm text-slate">Enable RSVP</label>
        </div>
        <p className="text-xs text-slate-dim">
          This invitation will be sent from you. Keep events occasional to maintain trust. Sending invites will be available in a future update.
        </p>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-navy hover:bg-gold-light">
            Send invite
          </button>
          <Link to="/" className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-slate hover:border-gold-dim hover:text-gold no-underline">
            Cancel
          </Link>
        </div>
        {submitted && (
          <p className="text-sm text-amber bg-amber/10 border border-amber/30 p-2 rounded-lg">
            Event invites will be available in a future update.
          </p>
        )}
      </form>
    </div>
  )
}

import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  collection,
  addDoc,
  serverTimestamp,
  writeBatch,
  doc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { parseCSV } from '@/lib/csv'

const CANONICAL_FIELDS = [
  'skip',
  'firstName',
  'lastName',
  'email',
  'phone',
  'propertyAddress',
  'city',
  'state',
  'zip',
  'closingDate',
  'notes',
  'goalText',
]

const DEFAULT_MAPPING = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  propertyAddress: 'propertyAddress',
  city: 'city',
  state: 'state',
  zip: 'zip',
  closingDate: 'closingDate',
  notes: 'notes',
  goalText: 'goalText',
}

function normalizeDate(val) {
  if (!val || typeof val !== 'string') return null
  const s = val.trim()
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(s)
  if (iso) return s
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  const year = s.match(/\d{4}/)
  if (year) return `${year[0]}-01-01`
  return null
}

function splitName(full) {
  const s = (full || '').trim()
  const parts = s.split(/\s+/)
  if (parts.length >= 2) {
    return { first: parts[0], last: parts.slice(1).join(' ') }
  }
  return { first: s || '', last: '' }
}

export default function Import() {
  const { agentId } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('upload') // upload | mapping | importing
  const [error, setError] = useState('')
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
  const [mapping, setMapping] = useState({}) // index -> canonical field
  const [showModal, setShowModal] = useState(false)
  const [importWithEnrich, setImportWithEnrich] = useState(false)

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const { headers: h, rows: r } = parseCSV(reader.result)
        if (!h.length) {
          setError("We couldn't read any columns from that file.")
          return
        }
        setHeaders(h)
        setRows(r)
        setStep('mapping')
        fetch('/api/map-columns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            headers: h,
            sampleRow: r[0] || [],
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            const next = {}
            ;(data.suggestions || []).forEach((s, i) => {
              next[i] = s.suggestedField || 'skip'
            })
            setMapping((prev) => ({ ...prev, ...next }))
          })
          .catch(() => {
            const next = {}
            h.forEach((_, i) => { next[i] = 'skip' })
            setMapping(next)
          })
      } catch (err) {
        setError(err.message || "We couldn't parse that file.")
      }
    }
    reader.readAsText(file, 'UTF-8')
  }, [])

  const uniqueProperties = () => {
    const seen = new Set()
    rows.forEach((row) => {
      const addr = (mapping[headers.findIndex((h) => h === headers[0])] !== undefined
        ? row[headers.findIndex((h) => headers.indexOf(h) === 0)]
        : null) ?? row.find((_, i) => mapping[i] === 'propertyAddress') ?? ''
      if (addr) seen.add(addr.trim().toLowerCase())
    })
    return seen.size
  }

  const runImport = useCallback(
    async (withEnrich) => {
      setImportWithEnrich(withEnrich)
      setShowModal(false)
      setStep('importing')
      setError('')
      const required = ['firstName', 'lastName', 'propertyAddress', 'closingDate']
      const getVal = (row, field) => {
        const idx = headers.findIndex((_, i) => mapping[i] === field)
        return idx >= 0 ? (row[idx] ?? '').trim() : ''
      }
      const valid = rows.filter((row) => {
        const first = getVal(row, 'firstName') || splitName(getVal(row, 'firstName') || row[0]).first
        const last = getVal(row, 'lastName') || splitName(getVal(row, 'firstName') || row[0]).last
        const addr = getVal(row, 'propertyAddress')
        const closing = getVal(row, 'closingDate') || normalizeDate(getVal(row, 'closingDate'))
        return (first || last) && addr && closing
      })

      try {
        const BATCH_SIZE = 400
        let count = 0
        for (let start = 0; start < valid.length; start += BATCH_SIZE) {
          const chunk = valid.slice(start, start + BATCH_SIZE)
          const batch = writeBatch(db)
          for (const row of chunk) {
            const firstRaw = getVal(row, 'firstName')
            const lastRaw = getVal(row, 'lastName')
            const fullRaw = firstRaw && lastRaw ? null : (row[headers.findIndex((_, i) => mapping[i] === 'firstName')] ?? row[0] ?? '')
            const split = fullRaw ? splitName(fullRaw) : { first: '', last: '' }
            const first = firstRaw || split.first || '—'
            const last = lastRaw || split.last || '—'
          const email = getVal(row, 'email')
          const phone = getVal(row, 'phone')
          const addressLine1 = getVal(row, 'propertyAddress')
          const city = getVal(row, 'city')
          const state = getVal(row, 'state')
          const zip = getVal(row, 'zip')
          const closingDate = normalizeDate(getVal(row, 'closingDate')) || getVal(row, 'closingDate')
          const notes = getVal(row, 'notes')
          const goalText = getVal(row, 'goalText')

          const homeownerRef = doc(collection(db, 'agents', agentId, 'homeowners'))
          batch.set(homeownerRef, {
            firstName: first || '—',
            lastName: last || '—',
            email: email || null,
            phone: phone || null,
            preferredChannel: 'email',
            goals: goalText ? { type: goalText, timeframe: '' } : null,
            createdAt: serverTimestamp(),
            lastContactedAt: null,
          })
          const propertyRef = doc(collection(db, 'agents', agentId, 'properties'))
          batch.set(propertyRef, {
            homeownerId: homeownerRef.id,
            addressLine1,
            city: city || null,
            state: state || null,
            zip: zip || null,
            lastAvmValue: null,
            lastAvmAt: null,
            avmStatus: 'idle',
            includeInRefresh: true,
            createdAt: serverTimestamp(),
          })
            batch.set(doc(collection(db, 'agents', agentId, 'transactions')), {
              homeownerId: homeownerRef.id,
              propertyId: propertyRef.id,
              closingDate: closingDate || null,
              salePrice: null,
            })
            count++
          }
          await batch.commit()
        }
        await addDoc(collection(db, 'auditLogs'), {
          agentId,
          action: 'import_confirmed',
          payload: { rowCount: count, withEnrich },
          timestamp: serverTimestamp(),
        })
        const entering57 = 0
        navigate('/import-success', { state: { count, entering57 } })
      } catch (err) {
        setError(err.message || 'Import failed. Try again.')
        setStep('mapping')
      }
    },
    [agentId, headers, mapping, rows, navigate]
  )

  const stepNum = step === 'upload' ? 1 : step === 'mapping' ? 2 : step === 'importing' ? 3 : 4
  const steps = [
    { num: 1, label: 'Upload', sub: 'Your file' },
    { num: 2, label: 'Map Columns', sub: 'Match fields' },
    { num: 3, label: 'Processing', sub: 'We tidy' },
    { num: 4, label: 'Complete', sub: 'Done' },
  ]

  const Stepper = () => (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, idx) => (
        <div key={s.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                stepNum > s.num
                  ? 'bg-gold text-navy'
                  : stepNum === s.num
                    ? 'bg-[var(--gold-glow)] border border-[rgba(201,168,76,0.25)] text-gold-light'
                    : 'bg-navy-light border border-[var(--border-soft)] text-slate-dim'
              }`}
            >
              {stepNum > s.num ? '✓' : s.num}
            </div>
            <span className={`text-[11px] mt-1.5 ${stepNum === s.num ? 'text-white' : 'text-slate'}`}>
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 rounded ${stepNum > s.num ? 'bg-gold-dim' : 'bg-[var(--border-soft)]'}`}
            />
          )}
        </div>
      ))}
    </div>
  )

  if (step === 'upload') {
    return (
      <div className="p-9 max-w-[760px] mx-auto">
        <Stepper />
        <div className="mb-9">
          <p className="text-[10px] tracking-[0.22em] uppercase text-gold flex items-center gap-2 mb-3">
            <span className="w-[18px] h-px bg-gold" /> Step 1 of 4
          </p>
          <h1 className="font-heading text-[36px] font-normal text-white leading-tight mb-2">
            Upload your contacts. <em className="italic text-gold-light">We'll tidy them up.</em>
          </h1>
          <p className="text-sm text-slate font-light leading-relaxed">
            Fast, private, and agent-branded. Drop your CSV below or choose a file.
          </p>
        </div>
        {error && (
          <p className="text-sm text-red bg-navy-card border border-red/30 p-3 rounded-lg mb-4" role="alert">
            {error}
          </p>
        )}
        <label className="block rounded-2xl border border-dashed border-slate-dim bg-navy-card p-14 text-center cursor-pointer hover:border-gold-dim hover:bg-navy-hover transition-all relative overflow-hidden mb-5">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--gold-glow),transparent_70%)] opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFile} />
          <span className="text-4xl block mb-4">📄</span>
          <span className="font-heading text-[22px] font-normal text-white block mb-2">Drop your CSV here</span>
          <span className="text-[13px] text-slate block mb-5">or click to browse</span>
          <span className="inline-block rounded-lg border border-[var(--border)] py-2 px-5 text-[13px] font-medium text-white-dim hover:border-gold-dim hover:text-gold transition-colors">
            Choose file
          </span>
        </label>
        <p className="text-[11px] text-slate-dim tracking-wide">Files are processed in your browser. We do not store the file.</p>
        <p className="text-xs text-slate mt-4">
          <a href="/sample-past-clients.csv" download className="text-yellow hover:text-gold-light no-underline">
            Download sample CSV (20 past clients)
          </a>
          {' '}to test the import flow.
        </p>
        <div className="grid grid-cols-2 gap-3 my-7">
          <div className="rounded-xl bg-navy-card border border-[var(--border-soft)] p-5 flex items-center gap-3 hover:border-[rgba(201,168,76,0.25)] hover:bg-navy-hover transition-colors cursor-pointer">
            <span className="text-2xl">🔗</span>
            <div>
              <div className="text-[13.5px] font-medium text-white">Import from CRM</div>
              <div className="text-[11.5px] text-slate">Optional</div>
            </div>
            <span className="ml-auto text-[9px] uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--gold-glow)] text-gold border border-[rgba(201,168,76,0.2)]">Optional</span>
          </div>
          <div className="rounded-xl bg-navy-card border border-[var(--border-soft)] p-5 flex items-center gap-3 hover:border-[rgba(201,168,76,0.25)] hover:bg-navy-hover transition-colors cursor-pointer">
            <span className="text-2xl">✨</span>
            <div>
              <div className="text-[13.5px] font-medium text-white">Concierge Import</div>
              <div className="text-[11.5px] text-slate">One-time fee</div>
            </div>
            <span className="ml-auto text-[9px] uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--gold-glow)] text-gold border border-[rgba(201,168,76,0.2)]">One-time fee</span>
          </div>
        </div>
        <div className="rounded-xl bg-navy-light border border-[var(--border-soft)] p-5">
          <div className="text-[10px] tracking-[0.18em] uppercase text-slate-dim mb-2.5">Required columns</div>
          <div className="flex gap-2 flex-wrap">
            {['first_name', 'last_name', 'property_address', 'closing_date', 'email or phone', 'goal', 'notes'].map((f) => (
              <span
                key={f}
                className={`text-[11.5px] px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                  ['first_name', 'last_name', 'property_address', 'closing_date'].includes(f)
                    ? 'border-[rgba(201,168,76,0.25)] text-gold-light'
                    : 'border-[var(--border-soft)] text-white-dim'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" /> {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'importing') {
    return (
      <div className="p-9 max-w-[760px] mx-auto">
        <Stepper />
        <div className="rounded-xl bg-navy-card border border-[var(--border)] p-12 text-center">
          <p className="text-white font-light">Cleaning your data…</p>
          <p className="text-sm text-slate mt-2">Import in progress. We'll redirect you when ready.</p>
        </div>
      </div>
    )
  }

  const mappedCount = Object.values(mapping).filter((v) => v && v !== 'skip').length
  const skipCount = headers.length - mappedCount
  const needReview = 0

  return (
    <div className="p-9 max-w-[760px] mx-auto">
      <Stepper />
      <div className="mb-6">
        <p className="text-[10px] tracking-[0.22em] uppercase text-gold flex items-center gap-2 mb-3">
          <span className="w-[18px] h-px bg-gold" /> Step 2 of 4
        </p>
        <h1 className="font-heading text-[36px] font-normal text-white leading-tight mb-2">
          Map your columns. <em className="italic text-gold-light">We did the heavy lifting.</em>
        </h1>
        <p className="text-sm text-slate font-light leading-relaxed">
          Confirm or adjust the mapping below. Skipped columns will not be imported.
        </p>
      </div>
      <div className="flex items-center gap-5 rounded-xl bg-navy-light border border-[var(--border-soft)] px-5 py-3.5 mb-6">
        <span className="flex items-center gap-2 text-xs text-slate">
          <span className="w-2 h-2 rounded-full bg-green" />
          <strong className="text-white-dim font-medium">{mappedCount}</strong> mapped
        </span>
        <span className="flex items-center gap-2 text-xs text-slate">
          <span className="w-2 h-2 rounded-full bg-amber" />
          <strong className="text-white-dim font-medium">{needReview}</strong> need review
        </span>
        <span className="flex items-center gap-2 text-xs text-slate">
          <span className="w-2 h-2 rounded-full bg-slate-dim" />
          <strong className="text-white-dim font-medium">{skipCount}</strong> skipped
        </span>
        <span className="text-xs text-slate">
          <strong className="text-white-dim font-medium">{rows.length}</strong> rows · {uniqueProperties()} unique properties
        </span>
      </div>
      {error && (
        <p className="text-sm text-red bg-navy-card border border-red/30 p-3 rounded-lg mb-4" role="alert">
          {error}
        </p>
      )}
      <div className="rounded-xl bg-navy-card border border-[var(--border)] overflow-hidden mb-5">
        <div className="grid grid-cols-[1fr_24px_1fr_80px] gap-3 items-center px-5 py-3 bg-navy-light border-b border-[var(--border-soft)]">
          <div className="text-[10px] tracking-[0.18em] uppercase text-slate-dim">CSV Header</div>
          <div />
          <div className="text-[10px] tracking-[0.18em] uppercase text-slate-dim">Maps to</div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-slate-dim">Confidence</div>
        </div>
        {headers.map((csvHeader, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_24px_1fr_80px] gap-3 items-center px-5 py-3 border-b border-[var(--border-soft)] last:border-0 hover:bg-white/[0.02]"
          >
            <div className="rounded-md bg-navy-light border border-[var(--border-soft)] px-3 py-2 text-[12.5px] text-white-dim truncate">
              {csvHeader}
            </div>
            <span className="text-slate-dim text-sm text-center">→</span>
            <select
              value={mapping[i] ?? 'skip'}
              onChange={(e) => setMapping((prev) => ({ ...prev, [i]: e.target.value }))}
              className="w-full rounded-md bg-navy-light border border-[var(--border-soft)] px-2.5 py-2 text-[12.5px] text-white focus:border-gold-dim focus:outline-none appearance-none bg-no-repeat bg-[length_12px_8px] bg-[right_10px_center] pr-8"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a90a8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")" }}
            >
              {CANONICAL_FIELDS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <span className="text-[10.5px] text-slate">—</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-gold px-5 py-2.5 text-[13px] font-medium text-navy hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(201,168,76,0.25)] transition-all"
        >
          Confirm & Enrich
        </button>
        <button
          type="button"
          onClick={() => runImport(false)}
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-[13px] font-medium text-white-dim hover:border-gold-dim hover:text-gold transition-colors"
        >
          Import without enrichment
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20">
          <div className="bg-navy-card border border-[var(--border)] rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h2 className="font-heading text-lg font-medium text-white">Estimated property value updates</h2>
            <p className="text-sm text-slate">
              We found {uniqueProperties()} unique properties. Running value updates for all will use
              ~{uniqueProperties()} updates. (Value updates coming in a later release.) Proceed with import?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => runImport(true)}
                className="flex-1 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-navy hover:bg-gold-light"
              >
                Proceed with updates
              </button>
              <button
                type="button"
                onClick={() => runImport(false)}
                className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-white-dim hover:border-gold-dim hover:text-gold"
              >
                Import without values
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

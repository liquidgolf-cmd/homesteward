import { Link } from 'react-router-dom'
import { useState } from 'react'

const MOCK_HEADERS = [
  { csv: 'Full Name', mapped: 'firstName, lastName' },
  { csv: 'Addr', mapped: 'propertyAddress' },
  { csv: 'BuyerEmail', mapped: 'email' },
  { csv: 'Sold Date', mapped: 'closingDate' },
  { csv: 'Comment', mapped: 'notes' },
]

export default function ImportMapping() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Map your columns</h1>
        <p className="text-slate-600 mt-1">
          We matched your headers — confirm or adjust quickly.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 font-medium text-slate-700">CSV Header</th>
              <th className="px-5 py-3 font-medium text-slate-700">Mapped Field</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_HEADERS.map((row, i) => (
              <tr key={i}>
                <td className="px-5 py-3 text-slate-800">{row.csv}</td>
                <td className="px-5 py-3">
                  <select className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
                    <option>{row.mapped}</option>
                    <option>firstName</option>
                    <option>lastName</option>
                    <option>email</option>
                    <option>phone</option>
                    <option>propertyAddress</option>
                    <option>closingDate</option>
                    <option>notes</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Confirm & enrich
        </button>
        <Link
          to="/import-success"
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Import without enrichment
        </Link>
      </div>

      {/* Estimated usage modal (wireframe) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Estimated property value updates</h2>
            <p className="text-sm text-slate-600">
              We found 187 unique properties. Running value updates for all will use ~187 updates
              (62% of your monthly allowance). Proceed?
            </p>
            <div className="flex gap-2 pt-2">
              <Link
                to="/import-success"
                className="flex-1 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 text-center"
              >
                Proceed with updates
              </Link>
              <Link
                to="/import-success"
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
              >
                Import without values
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

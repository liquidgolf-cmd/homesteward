function parseDate(d) {
  if (!d) return null
  const s = typeof d === 'string' ? d : (d?.toDate?.()?.toISOString?.() || '')
  if (!s) return null
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10)) : null
}

export function is5To7YearsAgo(date) {
  const d = parseDate(date)
  if (!d) return false
  const now = new Date()
  const years = (now - d) / (365.25 * 24 * 60 * 60 * 1000)
  return years >= 5 && years <= 7
}

/**
 * Derive suggested touchpoints from homeowners + transactions.
 * Rule: closing date 5-7 years ago -> "5-7 Yr Milestone"
 * Returns array of { homeownerId, homeownerName, reason, type }
 */
export function deriveSuggestedTouchpoints(homeowners, transactions) {
  const txByHomeowner = {}
  transactions.forEach((tx) => {
    const h = tx.homeownerId
    if (h && !txByHomeowner[h]) txByHomeowner[h] = tx.closingDate
  })
  const suggested = []
  homeowners.forEach((h) => {
    const closing = txByHomeowner[h.id]
    if (is5To7YearsAgo(closing)) {
      const name = [h.firstName, h.lastName].filter(Boolean).join(' ') || 'Client'
      suggested.push({
        homeownerId: h.id,
        homeownerName: name,
        reason: '5-7 Yr Milestone',
        type: '5-7 yr window',
      })
    }
  })
  return suggested
}

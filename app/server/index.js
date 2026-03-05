/**
 * RealEstateBuddy API server: CSV column mapping (LLM or heuristic).
 * Run: node server/index.js (or npm run server)
 * Set ANTHROPIC_API_KEY in .env for LLM mapping; otherwise heuristic is used.
 */
const http = require('http')

const CANONICAL_FIELDS = [
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

function heuristicMap(headers, sampleRow) {
  const normalized = (h) => (h || '').toLowerCase().replace(/[\s_-]+/g, ' ').trim()
  const rules = [
    [/first.*name|firstname/, 'firstName', 0.9],
    [/last.*name|lastname/, 'lastName', 0.9],
    [/^name$|full name/, 'firstName', 0.6],
    [/email/, 'email', 0.95],
    [/phone|mobile|cell/, 'phone', 0.9],
    [/address|addr|property/, 'propertyAddress', 0.9],
    [/^city$/, 'city', 0.9],
    [/^state$|^st$/, 'state', 0.9],
    [/zip|postal/, 'zip', 0.9],
    [/closing|sold|close.*date/, 'closingDate', 0.85],
    [/note|comment|remark/, 'notes', 0.8],
    [/goal/, 'goalText', 0.8],
  ]
  return headers.map((csvHeader) => {
    const n = normalized(csvHeader)
    let suggested = 'skip'
    let confidence = 0.5
    for (const [re, field, conf] of rules) {
      if (re.test(n)) {
        suggested = field
        confidence = conf
        break
      }
    }
    return { csvHeader, suggestedField: suggested, confidence }
  })
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/api/map-columns') {
    let body = ''
    for await (const chunk of req) body += chunk
    try {
      const { headers: csvHeaders, sampleRow } = JSON.parse(body)
      const suggestions = heuristicMap(csvHeaders || [], sampleRow || [])
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      res.end(JSON.stringify({ suggestions }))
    } catch (e) {
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(400)
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  res.writeHead(404)
  res.end('Not found')
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`RealEstateBuddy API listening on http://localhost:${PORT}`)
})

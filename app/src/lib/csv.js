/**
 * Simple CSV parser: first row = headers, rest = rows.
 * Handles quoted fields with commas.
 */
export function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim())
  if (lines.length === 0) return { headers: [], rows: [] }
  const parseLine = (line) => {
    const out = []
    let i = 0
    while (i < line.length) {
      if (line[i] === '"') {
        let end = i + 1
        while (end < line.length) {
          const next = line.indexOf('"', end)
          if (next === -1) break
          if (line[next + 1] === '"') {
            end = next + 2
            continue
          }
          end = next
          break
        }
        out.push(line.slice(i + 1, end).replace(/""/g, '"').trim())
        i = end + 1
        if (line[i] === ',') i++
        continue
      }
      const comma = line.indexOf(',', i)
      if (comma === -1) {
        out.push(line.slice(i).trim())
        break
      }
      out.push(line.slice(i, comma).trim())
      i = comma + 1
    }
    return out
  }
  const headers = parseLine(lines[0])
  const rows = lines.slice(1).map((line) => parseLine(line))
  return { headers, rows }
}

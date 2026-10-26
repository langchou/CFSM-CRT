export function expiryInfo(value, now = Date.now()) {
  const raw = String(value || '').trim()
  if (!raw) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T|\s)/.exec(raw)
  if (!match) return { text: raw, short: raw, level: 'dim' }
  const [, year, month, day] = match.map(Number)
  const target = new Date(Date.UTC(year, month - 1, day))
  if (target.getUTCFullYear() !== year || target.getUTCMonth() !== month - 1 || target.getUTCDate() !== day) {
    return { text: raw, short: raw, level: 'dim' }
  }
  const today = new Date(now)
  // Compare calendar days so midnight and daylight-saving shifts do not round up.
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const days = Math.round((target.getTime() - start) / 86400000)
  const short = days < 0 ? 'expired' : days === 0 ? 'today' : days + 'd left'
  return {
    text: raw.slice(0, 10) + ' (' + short + ')',
    short,
    level: days < 0 ? 'err' : days <= 30 ? 'warn' : 'b'
  }
}

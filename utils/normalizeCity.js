export function normalizeCity(val) {
  const v = Array.isArray(val) ? val[0] : val
  const s = String(v ?? '').trim().toLowerCase()
  if (!s || s === 'null' || s === 'undefined' || s === 'nan') return ''
  return s
}

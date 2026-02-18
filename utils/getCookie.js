export function getCookie(req, name) {
  const raw = req?.headers?.cookie || ''
  const escaped = name.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
  const m = raw.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : ''
}

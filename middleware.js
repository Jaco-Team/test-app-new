// middleware.js
import { NextResponse } from 'next/server'

function isLowerCase(str) {
  return str === str.toLowerCase()
}

function refDomain(ref) {
  try { return ref ? new URL(ref).hostname.replace(/^www\./, '') : '' } catch { return '' }
}

function isPageViewRequest(request, url) {
  const dest   = request.headers.get('sec-fetch-dest') || ''
  const mode   = request.headers.get('sec-fetch-mode') || ''
  const accept = request.headers.get('accept') || ''

  const path = url.pathname

  // Явно отсекаем файлы по расширению (icons, manifest, css, js и т.п.)
  if (path.includes('.')) return false

  // Современные браузеры: только top-level navigation
  if (dest && dest !== 'document') return false
  if (mode && mode !== 'navigate') return false

  // Fallback для старых: ожидаем HTML
  if (!accept.includes('text/html')) return false

  return true
}

function classifySource({ url, ref, utm }) {
  // 1) Если есть UTM — они главные
  if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
    return {
      source: utm.utm_source || '(utm)',
      medium: utm.utm_medium || '(utm)',
      campaign: utm.utm_campaign || null,
      term: utm.utm_term || null,
      content: utm.utm_content || null,
      classifier: 'utm'
    }
  }
  // 2) Кликид — трактуем как платный трафик
  if (utm.gclid) return { source: 'google', medium: 'cpc', campaign: null, term: null, content: null, classifier: 'gclid' }
  if (utm.yclid) return { source: 'yandex', medium: 'cpc', campaign: null, term: null, content: null, classifier: 'yclid' }

  // 3) Реферер
  const host = refDomain(ref)
  if (!host) return { source: 'direct', medium: 'none', campaign: null, term: null, content: null, classifier: 'direct' }

  if (/google\./i.test(host)) return { source: 'google', medium: 'organic', campaign: null, term: null, content: null, classifier: 'ref-organic' }
  if (/yandex\./i.test(host)) return { source: 'yandex', medium: 'organic', campaign: null, term: null, content: null, classifier: 'ref-organic' }
  if (/bing\./i.test(host))   return { source: 'bing',   medium: 'organic', campaign: null, term: null, content: null, classifier: 'ref-organic' }

  // Внутренний переход не считаем источником
  const siteHost = url.host.replace(/^www\./, '')
  if (host === siteHost) return { source: 'direct', medium: 'none', campaign: null, term: null, content: null, classifier: 'internal' }

  // Иначе — реферальный трафик
  return { source: host, medium: 'referral', campaign: null, term: null, content: null, classifier: 'referral' }
}

function safeDecodeURIComponent(str) {
  try { return decodeURIComponent(str) } catch { return str }
}

// Режем “хвост мусора” в каждом сегменте пути:
// - если встречаем пробел/контрол (в т.ч. %20, %00, %09, %0a/%0d и т.п.) → обрезаем сегмент до него
// - если сегмент начинается с & или %26 → считаем, что дальше мусор, обрываем путь на предыдущем сегменте
// - убираем эмодзи (если попали внутрь сегмента)
// - убираем хвостовые точки/дефисы
function sanitizePathname(pathname) {
  const raw = String(pathname || '')
  const parts = raw.split('/') // raw сегменты (с %XX внутри)
  const out = [''] // leading slash

  for (let i = 1; i < parts.length; i++) {
    const rawSeg = parts[i]
    if (!rawSeg) continue // убираем пустые сегменты (//) и trailing '/'

    // /&xxx или /%26xxx или /%2526xxx -> обрываем путь на предыдущем сегменте
    if (/^(?:&|%26|%2526)/i.test(rawSeg)) break

    // 1) literal пробелы/контролы (редко, но бывает)
    let cut = rawSeg.search(/[\s\x00-\x1F\x7F]/)

    // 2) %20 (space) и любые control-байты %00-%1F, %7F
    const m1 = rawSeg.search(/%(?:20|0[0-9a-f]|1[0-9a-f]|7f)/i)
    if (m1 !== -1) cut = cut === -1 ? m1 : Math.min(cut, m1)

    // 3) double-encode: %2520, %2500, %2509, ...
    const m2 = rawSeg.search(/%25(?:20|0[0-9a-f]|1[0-9a-f]|7f)/i)
    if (m2 !== -1) cut = cut === -1 ? m2 : Math.min(cut, m2)

    const rawPrefix = cut === -1 ? rawSeg : rawSeg.slice(0, cut)
    let seg = safeDecodeURIComponent(rawPrefix)

    // если после декода вдруг появились пробелы/контролы — режем по первому
    seg = seg.split(/[\s\x00-\x1F\x7F]/)[0]

    // вычищаем эмодзи, если вдруг попали в сегмент
    try { seg = seg.replace(/\p{Extended_Pictographic}+/gu, '') } catch {}

    // хвостовой мусор типа "rolly---" или "rolly..."
    seg = seg.replace(/[.\-]+$/g, '')

    if (!seg) break
    out.push(seg)
  }

  let cleaned = out.join('/')

  // схлопываем /////
  cleaned = cleaned.replace(/\/{2,}/g, '/')

  // гарантируем leading slash
  if (!cleaned.startsWith('/')) cleaned = '/' + cleaned

  // убираем trailing slash (кроме корня)
  if (cleaned.length > 1) cleaned = cleaned.replace(/\/+$/, '')

  // пусто -> корень
  if (cleaned === '') cleaned = '/'

  return cleaned
}

export const config = {
  // Не перехватываем статику/служебные файлы
  matcher: ['/((?!_next|favicon.ico|robots.txt|sitemap.xml|images|fonts|static).*)'],
}

export async function middleware(request) {
  //const response = NextResponse.next()
  const { nextUrl } = request

  // флаг, что это именно загрузка страницы, а не иконка
  const isPageView = isPageViewRequest(request, nextUrl)

  // === ЕДИНЫЙ РЕДИРЕКТ (ОДИН ШАГ) ===
  // Собираем финальный URL сразу: https + /togliatti для корня + lower-case + чистка "мусорных" query
  const target = nextUrl.clone()
  let changed = false

  // 1) HTTPS — насильно даже на localhost для теста
  // const proto = request.headers.get('x-forwarded-proto')
  // if (proto !== 'https') {
  //   target.protocol = 'https'
  //   changed = true
  // }

  // 0) Санитайзим pathname: /samara/menu/rolly%20asdasd -> /samara/menu/rolly
  const cleanPath = sanitizePathname(target.pathname)
  if (cleanPath !== target.pathname) {
    target.pathname = cleanPath
    changed = true
  }

  const proto = request.headers.get('x-forwarded-proto')
  const hostname = nextUrl.hostname
  if (hostname !== 'localhost' && hostname !== '127.0.0.1' && proto !== 'https') {
    target.protocol = 'https'; changed = true
  }

  // 2) Корень -> город по умолчанию
  if (target.pathname === '/' || target.pathname === '') {
    target.pathname = '/togliatti'
    changed = true
  }

  // 3) Приводим path к lower-case (файлы не трогаем)
  if (!target.pathname.includes('.') && !isLowerCase(target.pathname)) {
    target.pathname = target.pathname.toLowerCase()
    changed = true
  }

  // 4) Чистим "мусорные" query (UTM не трогаем)
  if (target.searchParams.has('text') || target.searchParams.has('showItem') ||
    Array.from(target.searchParams.keys()).some(k => k.startsWith('act_'))) {
    target.searchParams.delete('text')
    target.searchParams.delete('showItem')
    for (const k of Array.from(target.searchParams.keys())) if (k.startsWith('act_')) target.searchParams.delete(k)
    changed = true
  }

  // 5) Если что-то поменяли — отдаём ОДИН 308 сразу на конечный URL
  if (changed && target.toString() !== nextUrl.toString()) {
    return NextResponse.redirect(target, 308) // ВАЖНО: 308 (постоянный)
  }
  // === КОНЕЦ ЕДИНОГО РЕДИРЕКТА ===

  const response = NextResponse.next()

  // --- Спец-кука по UTM ---
  const utmParam = nextUrl.searchParams.get('utm')
  if (utmParam === 'promo123') {
    response.cookies.set('isSpecialUser', utmParam, {
      maxAge: 60 * 60 * 24 * 30, path: '/', sameSite: 'none', secure: true
    })
  }

  // --- Чистим "мусорные" query --- уже сделали выше в едином блок
  // const qs = nextUrl.search
  // if (qs.includes('?text') || qs.includes('?showItem') || qs.includes('?act_')) {
  //   const newUrl = nextUrl.clone()
  //   newUrl.searchParams.delete('text')
  //   newUrl.searchParams.delete('showItem')
  //   for (const key of newUrl.searchParams.keys()) if (key.startsWith('act_')) newUrl.searchParams.delete(key)
  //   return NextResponse.redirect(newUrl, 301)
  // }

  // --- Приводим path к lower-case --- уже сделали выше в едином блок
  // const { pathname } = nextUrl
  // if (!isLowerCase(pathname) && !pathname.includes('.')) {
  //   const lowerUrl = nextUrl.clone()
  //   lowerUrl.pathname = pathname.toLowerCase()
  //   return NextResponse.redirect(lowerUrl, 301)
  // }

  // ---------------------- ТРЕКИНГ СЕССИЙ (визитов) ----------------------
  // vid — посетитель на 1 год
  let vid = request.cookies.get('vid')?.value
  if (!vid) {
    vid = crypto.randomUUID()
    response.cookies.set('vid', vid, { path: '/', maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: 'Lax', secure: true })
  }

  // sid — сессия (30 минут простоя)
  const now = Date.now()
  const THIRTY_MIN = 30 * 60 * 1000

  let sid = request.cookies.get('sid')?.value
  let sidTs = Number(request.cookies.get('sid_ts')?.value || 0)
  let isNewSession = false

  if (!sid || !sidTs || (now - sidTs) > THIRTY_MIN) {
    sid = crypto.randomUUID()
    isNewSession = true
    // первая посадочная в рамках сессии
    if (isPageView) {
      response.cookies.set('sid_lp', nextUrl.pathname + (nextUrl.search || ''), { path: '/', maxAge: 60 * 30, httpOnly: true, sameSite: 'Lax', secure: true })
    }
  }

  // обновляем "последнюю активность" и сам sid (скользящее окно)
  response.cookies.set('sid', sid,     { path: '/', maxAge: 60 * 30, httpOnly: true, sameSite: 'Lax', secure: true })
  response.cookies.set('sid_ts', String(now), { path: '/', maxAge: 60 * 30, httpOnly: true, sameSite: 'Lax', secure: true })

  // --- если новая сессия — отправляем визит на Laravel ---
  if (isNewSession && isPageView) {
    // собираем utm/кликиды
    const utm = {}
    ;['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','yclid']
      .forEach(k => { const v = nextUrl.searchParams.get(k); if (v) utm[k] = v })

    const ref = request.headers.get('referer') || ''
    const src = classifySource({ url: nextUrl, ref, utm })

    const payload = {
      vid,
      sid,
      started_at: new Date().toISOString(),                     // UTC
      landing_path: nextUrl.pathname + (nextUrl.search || ''),
      referrer: ref || null,
      source: src.source,
      medium: src.medium,
      campaign: src.campaign,
      term: src.term,
      content: src.content,
      classifier: src.classifier,                                // как определили источник
      utm,
      host: request.headers.get('host') || nextUrl.host,
      ua: request.headers.get('user-agent') || '',
      ip: (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || null,
    }

    const endpoint = process.env.TRACKING_API_ENDPOINT || 'https://laravel.example.com/api/visit'
    const token    = process.env.TRACKING_API_TOKEN || ''

    // короткий таймаут, чтобы не блокировать TTFB
    const ctrl  = new AbortController()
    const timer = setTimeout(() => ctrl.abort('timeout'), 400)

    try {
      //console.log('TRACKING:', payload)

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      })
    } catch {
      // игнорируем ошибки — бизнес-страница важнее
    } finally {
      clearTimeout(timer)
    }
  }
  // ---------------------------------------------------------------------

  // CORS (если нужен) — '*' нельзя с credentials=true
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  response.headers.set('Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  return response
}

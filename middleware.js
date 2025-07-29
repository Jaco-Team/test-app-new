// middleware.js
import { NextResponse } from 'next/server'

function isLowerCase(str) {
  return str === str.toLowerCase()
}

function refDomain(ref) {
  try { return ref ? new URL(ref).hostname.replace(/^www\./, '') : '' } catch { return '' }
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

export const config = {
  // Не перехватываем статику/служебные файлы
  matcher: ['/((?!_next|favicon.ico|robots.txt|sitemap.xml|images|fonts|static).*)'],
}

export async function middleware(request) {
  const response = NextResponse.next()
  const { nextUrl } = request

  // --- HTTPS редирект (кроме localhost) ---
  const proto = request.headers.get('x-forwarded-proto')
  const hostname = nextUrl.hostname
  if (hostname !== 'localhost' && hostname !== '127.0.0.1' && proto !== 'https') {
    const httpsUrl = nextUrl.clone()
    httpsUrl.protocol = 'https'
    return NextResponse.redirect(httpsUrl, 301)
  }

  // --- Спец-кука по UTM ---
  const utmParam = nextUrl.searchParams.get('utm')
  if (utmParam === 'promo123') {
    response.cookies.set('isSpecialUser', utmParam, {
      maxAge: 60 * 60 * 24 * 30, path: '/', sameSite: 'none', secure: true
    })
  }

  // --- Чистим "мусорные" query ---
  const qs = nextUrl.search
  if (qs.includes('?text') || qs.includes('?showItem') || qs.includes('?act_')) {
    const newUrl = nextUrl.clone()
    newUrl.searchParams.delete('text')
    newUrl.searchParams.delete('showItem')
    for (const key of newUrl.searchParams.keys()) if (key.startsWith('act_')) newUrl.searchParams.delete(key)
    return NextResponse.redirect(newUrl, 301)
  }

  // --- Приводим path к lower-case ---
  const { pathname } = nextUrl
  if (!isLowerCase(pathname) && !pathname.includes('.')) {
    const lowerUrl = nextUrl.clone()
    lowerUrl.pathname = pathname.toLowerCase()
    return NextResponse.redirect(lowerUrl, 301)
  }

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
    response.cookies.set('sid_lp', nextUrl.pathname + (nextUrl.search || ''), { path: '/', maxAge: 60 * 30, httpOnly: true, sameSite: 'Lax', secure: true })
  }

  // обновляем "последнюю активность" и сам sid (скользящее окно)
  response.cookies.set('sid', sid,     { path: '/', maxAge: 60 * 30, httpOnly: true, sameSite: 'Lax', secure: true })
  response.cookies.set('sid_ts', String(now), { path: '/', maxAge: 60 * 30, httpOnly: true, sameSite: 'Lax', secure: true })

  // --- если новая сессия — отправляем визит на Laravel ---
  if (isNewSession) {
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
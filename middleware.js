import { NextResponse } from 'next/server'

function isLowerCase(str) {
  return str === str.toLowerCase();
}

export const config = {
  matcher: '/:path*',
}

export function middleware(request) {
  // Создаём ответ заранее (NextResponse.next())
  const response = NextResponse.next();
  const { nextUrl } = request;

  // 1. Ставим куку, если UTM совпадает с нужной
  const utm = nextUrl.searchParams.get('utm');
  if (utm === 'promo123') {
    response.cookies.set('isSpecialUser', utm, {
      maxAge: 60 * 60 * 24 * 30, // 30 дней
      path: '/',
      sameSite: 'none',
      secure: true
    });
  }

  // 2. Принудительно перенаправляем на HTTPS (кроме localhost)
  const proto = request.headers.get('x-forwarded-proto');
  const hostname = nextUrl.hostname;
  if (
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1' &&
    proto !== 'https'
  ) {
    const httpsUrl = nextUrl.clone();
    httpsUrl.protocol = 'https';
    return NextResponse.redirect(httpsUrl, 301);
  }

  // 3. Удаляем из URL некоторые параметры (?text, ?showItem, ?act_...)
  // Если нужно именно "наличие в query string", используем includes
  const queryString = nextUrl.search; // например, "?text=123"
  if (
    queryString.includes('?text') ||
    queryString.includes('?showItem') ||
    queryString.includes('?act_')
  ) {
    // Клонируем и убираем эти параметры
    const newUrl = nextUrl.clone();
    // Если это обычные параметры (text=, showItem=), их можно удалить через searchParams
    newUrl.searchParams.delete('text');
    newUrl.searchParams.delete('showItem');
    // Если ?act_ — это что-то вроде ?act_123=...,
    // то можно пройтись по всем ключам и удалить начинающиеся на "act_"
    for (const key of newUrl.searchParams.keys()) {
      if (key.startsWith('act_')) {
        newUrl.searchParams.delete(key);
      }
    }
    return NextResponse.redirect(newUrl, 301);
  }

  // 4. Приводим путь к нижнему регистру, если нет точки (не файл)
  const { pathname } = nextUrl;
  if (!isLowerCase(pathname) && !pathname.includes('.')) {
    const lowerUrl = nextUrl.clone();
    lowerUrl.pathname = pathname.toLowerCase();
    return NextResponse.redirect(lowerUrl, 301);
  }

  // 5. Добавляем CORS-заголовки к ответу
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*'); // Или ваш домен
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, ' +
    'Content-MD5, Content-Type, Date, X-Api-Version'
  );

  return response;
}
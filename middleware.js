import { NextResponse } from 'next/server'
//import sslRedirect from 'next-ssl-redirect-middleware';

//export default sslRedirect({});

function isUpperCase(str) {
  return str === str.toUpperCase();
}

function isLowerCase(str) {
  return str === str.toLowerCase();
}

export function middleware(request) {
  const protocol = req.headers.get('x-forwarded-proto');

  if(protocol !== 'https') {
    const url = new URL(req.url);
    url.protocol = 'https:';
    return NextResponse.redirect(url.toString());
  }


  /*if( request.nextUrl.hostname != 'localhost' && request.nextUrl.protocol == 'http:' ){
    return NextResponse.redirect(new URL('https://' + request.nextUrl.host + request.nextUrl.pathname, request.url), 301)
  }*/

  let checkItem = request.nextUrl.search.split('?text');

  if( checkItem[1] ){
    return NextResponse.redirect(new URL(request.nextUrl.pathname, request.url), 301)
  }

  checkItem = request.nextUrl.search.split('?showItem');

  if( checkItem[1] ){
    return NextResponse.redirect(new URL(request.nextUrl.pathname, request.url), 301)
  }

  checkItem = request.nextUrl.search.split('?act_');

  if( checkItem[1] ){
    return NextResponse.redirect(new URL(request.nextUrl.pathname, request.url), 301)
  }

  checkItem = request.nextUrl.pathname.split('.');

  if( !isLowerCase(request.nextUrl.pathname) && !checkItem[1] ){
    return NextResponse.redirect(new URL(request.nextUrl.pathname.toLowerCase(), request.url), 301)
  }

  return NextResponse.next()
}
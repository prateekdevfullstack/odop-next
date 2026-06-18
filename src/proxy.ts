import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const userPreference = request.cookies.get('NEXT_LOCALE')?.value;
  const isHindiUrl = pathname === '/hi' || pathname.startsWith('/hi/');

  // Redirect to match saved locale preference
  if (userPreference === 'hi' && !isHindiUrl) {
    const url = request.nextUrl.clone();
    url.pathname = `/hi${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url, { status: 307 });
  }

  if (userPreference === 'en' && isHindiUrl) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/hi' ? '/' : pathname.slice(3) || '/';
    return NextResponse.redirect(url, { status: 307 });
  }

  if (pathname.startsWith('/hi/') || pathname === '/hi') {
    const newPath = pathname.replace(/^\/hi/, '') || '/';
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    const response = NextResponse.rewrite(url);
    
    response.headers.set('x-lang', 'hi');
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('x-lang', 'en');
  return response;
}

// Ensure the middleware only runs on actual pages, not on images, api routes, or static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }
  return new TextEncoder().encode(secret);
};

const rolePermissions: Record<string, string[]> = {
  admin: ['/admin'],
  baker: ['/admin/dashboard', '/admin/production', '/admin/inventory', '/admin/recipes']
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authTokenCookie = request.cookies.get('auth_token');
  const isAuthPage = pathname === '/admin/login';
  const isAdminRoot = pathname === '/admin' || pathname === '/admin/';
  
  if (isAdminRoot) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (!authTokenCookie && !isAuthPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  if (authTokenCookie) {
    try {
      const { payload } = await jwtVerify(authTokenCookie.value, getJwtSecretKey());
      
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      const userRole = payload.role as string;
      const allowedRoutes = rolePermissions[userRole] || [];
      const isAuthorized = allowedRoutes.some(route => pathname.startsWith(route));

      if (!isAuthorized) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      
      // Añadimos los datos del usuario a las cabeceras de la petición
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-payload', JSON.stringify(payload));
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.set('auth_token', '', { maxAge: -1, path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
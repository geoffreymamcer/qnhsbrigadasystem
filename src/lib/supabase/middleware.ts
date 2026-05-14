import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Handles session refreshing and route protection.
 * Ensures only authenticated users can access the system data.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();

  // Route protection logic
  const isRootPath = request.nextUrl.pathname === '/';
  
  // 1. Redirect to login if trying to access protected route without session
  if (!user && !isRootPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Redirect to dashboard if trying to access login while already authenticated
  if (user && isRootPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

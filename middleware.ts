import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

// Create the next-intl middleware for locale routing
const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  // Step 1: Run next-intl middleware for locale routing
  const response = intlMiddleware(request)

  // Step 2: Determine the actual pathname without locale prefix
  const pathname = request.nextUrl.pathname
  // Strip locale prefix if present (e.g., /en/dashboard -> /dashboard)
  const pathnameWithoutLocale = pathname.replace(/^\/(de|en)/, '') || '/'

  // Step 3: Check if this is a protected route
  const isProtectedDashboard = pathnameWithoutLocale.startsWith('/dashboard')
  const isProtectedAdmin = pathnameWithoutLocale.startsWith('/admin')
  const isProtectedBooking = pathnameWithoutLocale.includes('/book')

  if (!isProtectedDashboard && !isProtectedAdmin && !isProtectedBooking) {
    return response // No auth needed, return locale-routed response
  }

  // Step 4: Create Supabase client with cookie passthrough on the RESPONSE from intl middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do NOT use getSession() — it reads from unverified JWT.
  // getUser() sends a request to the Supabase Auth server to verify.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Determine locale for redirect URLs
  const locale = pathname.match(/^\/(de|en)/)?.[1] || routing.defaultLocale

  // Protect /dashboard routes — require authenticated user
  if (isProtectedDashboard && !user) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/auth`
    return NextResponse.redirect(url)
  }

  // Protect booking pages — require authenticated user
  if (isProtectedBooking && !user) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/auth`
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Protect /admin routes — require authenticated admin user
  if (isProtectedAdmin) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/auth`
      return NextResponse.redirect(url)
    }

    // Check admin role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}`
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: Must return the response — it contains both locale cookies and refreshed session cookies
  return response
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // getUser() verifierar token mot Supabase. getSession() läser bara kakan och
  // litar på innehållet, vilket inte duger som skydd på servern.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = req.nextUrl

  if (!user && pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (user && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}

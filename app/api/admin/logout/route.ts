import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })
  await supabase.auth.signOut()
  return NextResponse.json({ success: true })
}

// Handle GET requests
export async function GET(_request: NextRequest) {
  return NextResponse.json({ message: 'Use POST to logout' }, { status: 405 })
}

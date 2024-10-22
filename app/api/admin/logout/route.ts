import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(_request: NextRequest) {
  // Clear the admin_token cookie
  cookies().delete('admin_token')

  // Return a response indicating successful logout
  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
}

// Handle GET requests
export async function GET(_request: NextRequest) {
  return NextResponse.json({ message: 'Use POST to logout' }, { status: 405 })
}

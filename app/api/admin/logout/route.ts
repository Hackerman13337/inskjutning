import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(_request: NextRequest) {
  // Clear the session or perform logout logic here
  // For example, you might clear cookies or invalidate a session token

  // Return a response indicating successful logout
  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
}

// Optionally, you can also handle GET requests if needed
export async function GET(_request: NextRequest) {
  return NextResponse.json({ message: 'Logout endpoint' }, { status: 200 })
}

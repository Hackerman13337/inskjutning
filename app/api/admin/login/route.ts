import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
console.log('Admin password:', ADMIN_PASSWORD) // Lägg till denna rad

export async function POST(request: Request) {
  const { password } = await request.json()
  console.log('Submitted password:', password)
  console.log('Stored password:', ADMIN_PASSWORD)

  if (password === ADMIN_PASSWORD) {
    cookies().set('admin_token', 'your_secure_token_here', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    })
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}

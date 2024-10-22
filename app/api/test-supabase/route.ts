import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase.from('articles').select('count').single()
    
    if (error) throw error

    return NextResponse.json({ message: 'Supabase connection successful', count: data.count })
  } catch (error) {
    console.error('Supabase connection error:', error)
    return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
  }
}

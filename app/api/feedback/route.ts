import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  console.log('Fetching feedback from Supabase...')
  
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Fetched feedback:', data)

    // Transform the data to match the expected structure
    const transformedData = data.map(item => ({
      timestamp: item.created_at,
      content: item.message
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  console.log('Feedback submission attempt received')
  
  try {
    const { message } = await request.json()
    console.log('Received message:', message)
    
    const { data, error } = await supabase
      .from('feedback')
      .insert([{ message, created_at: new Date().toISOString() }])

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Feedback inserted successfully:', data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in feedback submission:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

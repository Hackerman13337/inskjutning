import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

console.log('API route file loaded')

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log('Fetched articles:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'An error occurred while fetching articles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const article = await request.json()
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: article.title,
        slug: article.slug,
        content: article.content,
        meta_description: article.metaDescription
      }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Article saved:', data)
    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

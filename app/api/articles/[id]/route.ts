import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const article = await request.json()

  const { data, error } = await supabase
    .from('articles')
    .update({
      title: article.title,
      slug: article.slug,
      content: article.content,
      meta_description: article.metaDescription,
      updated_at: new Date().toISOString()
    })
    .eq('id', params.id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}

import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getAuthenticatedUser, unauthorized } from '@/lib/api-auth'

/** Listan över artiklar är publik. */
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Kunde inte hämta artiklar:', error)
    return NextResponse.json({ error: 'Kunde inte hämta artiklarna' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  try {
    const article = await request.json().catch(() => null)

    if (!article || typeof article.title !== 'string' || typeof article.slug !== 'string') {
      return NextResponse.json({ error: 'Titel och slug måste anges' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title: article.title,
          slug: article.slug,
          content: article.content,
          meta_description: article.metaDescription ?? article.meta_description,
        },
      ])
      .select()

    if (error) {
      console.error('Kunde inte skapa artikel:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Oväntat fel när artikeln skulle skapas:', error)
    return NextResponse.json({ error: 'Något gick fel' }, { status: 500 })
  }
}

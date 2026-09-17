import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getAuthenticatedUser, unauthorized } from '@/lib/api-auth'

interface RouteParams {
  params: { id: string }
}

/** Artiklar är publika, så läsning kräver ingen inloggning. */
export async function GET(_request: Request, { params }: RouteParams) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (error) {
    console.error('Kunde inte hämta artikel:', error)
    return NextResponse.json({ error: 'Kunde inte hämta artikeln' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Artikeln finns inte' }, { status: 404 })
  }

  return NextResponse.json(data)
}

/**
 * Uppdaterar en artikel. Saknade tidigare inloggningskontroll helt, vilket
 * innebar att vem som helst kunde skriva om innehållet på sajten.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const article = await request.json().catch(() => null)

  if (!article || typeof article.title !== 'string' || typeof article.slug !== 'string') {
    return NextResponse.json({ error: 'Titel och slug måste anges' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })
  const { data, error } = await supabase
    .from('articles')
    .update({
      title: article.title,
      slug: article.slug,
      content: article.content,
      meta_description: article.metaDescription ?? article.meta_description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()

  if (error) {
    console.error('Kunde inte spara artikel:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Artikeln finns inte' }, { status: 404 })
  }

  return NextResponse.json(data[0])
}

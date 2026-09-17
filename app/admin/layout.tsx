import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * Admin är inloggningsskyddat och får aldrig förrenderas vid bygget — sidorna
 * ska alltid byggas per förfrågan så att sessionen kan läsas.
 */
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  await supabase.auth.getSession()

  return <>{children}</>
}

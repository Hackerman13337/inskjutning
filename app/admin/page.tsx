import { redirect } from 'next/navigation'

/**
 * Äldre adress. Allt innehåll finns numera i /admin/dashboard, som har både
 * feedback och artiklar i samma vy.
 */
export default function AdminPage() {
  redirect('/admin/dashboard')
}

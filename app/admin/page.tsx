import { supabase } from '../../lib/supabase'

interface FeedbackItem {
  id: number
  message: string
  created_at: string
}

async function getFeedback(): Promise<FeedbackItem[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export default async function AdminPage() {
  const feedback = await getFeedback()

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Feedback</h2>
      <ul>
        {feedback.map((item: FeedbackItem) => (
          <li key={item.id}>
            {new Date(item.created_at).toLocaleString()}: {item.message}
          </li>
        ))}
      </ul>
    </div>
  )
}

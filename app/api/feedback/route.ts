import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'feedback.log')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const feedbackItems = fileContent.trim().split('\n').map(line => {
      const [timestamp, ...contentParts] = line.split(':')
      const date = new Date(timestamp)
      const formattedDate = isNaN(date.getTime()) 
        ? 'Invalid Date' 
        : date.toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
      return {
        timestamp: formattedDate,
        content: contentParts.join(':').trim()
      }
    }).reverse()

    return NextResponse.json(feedbackItems)
  } catch (error) {
    console.error('Error reading feedback:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { feedback } = await request.json()
    
    if (!feedback) {
      return NextResponse.json({ error: 'Feedback is required' }, { status: 400 })
    }

    const timestamp = new Date().toISOString()
    const feedbackEntry = `${timestamp}: ${feedback}\n`

    const filePath = path.join(process.cwd(), 'feedback.log')
    await fs.appendFile(filePath, feedbackEntry, 'utf8')

    return NextResponse.json({ message: 'Feedback received' }, { status: 200 })
  } catch (error) {
    console.error('Error saving feedback:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const sql = `INSERT INTO contact_messages (full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)`
    await executeQuery(sql, [name, email, phone || null, subject, message])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form insert failed', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 
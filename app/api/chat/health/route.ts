import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

export async function GET() {
  try {
    // Skip DB check if ATS DB envs are not configured to avoid log noise in dev
    if (!process.env.DB_ATS_PASSWORD || !process.env.DB_ATS_HOST) {
      return NextResponse.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'skipped'
      })
    }

    // Simple query to test database connection
    await executeQuery('SELECT 1', [], 'ats')
    
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    })
  } catch (error) {
    console.error('Database health check failed:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: 'Database connection failed'
      },
      { status: 503 }
    )
  }
} 
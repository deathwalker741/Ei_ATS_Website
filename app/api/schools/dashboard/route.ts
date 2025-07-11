import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  throw new Error('JWT_SECRET environment variable is required. Please check your .env.local file.')
})()

function verifyToken(request: NextRequest) {
  const token = request.cookies.get('school-token')?.value
  if (!token) {
    throw new Error('No authentication token provided')
  }

  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decoded = verifyToken(request)
    const schoolCode = decoded.schoolCode

    // Get school info
    const schoolQuery = `
      SELECT schoolno, schoolname, city 
      FROM schools 
      WHERE schoolno = ?
    `
    const schoolResults = await executeQuery(schoolQuery, [schoolCode], 'school') as any[]
    
    if (schoolResults.length === 0) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    const schoolInfo = schoolResults[0]

    // Get current year stats (2025)
    const currentYearQuery = `
      SELECT 
        COUNT(DISTINCT a.panNumber) AS totalQualifiers,
        COUNT(DISTINCT CASE WHEN b.paymentStatus = 'paid' THEN a.panNumber END) AS successfulPayments
      FROM ats_qualifiers a 
      LEFT JOIN duketip_registrationDetails b ON a.panNumber = b.panNumber AND b.year = 2025
      WHERE a.schoolcode = ? AND a.programmeDetailID = 113
    `
    
    const currentYearResults = await executeQuery(currentYearQuery, [schoolCode], 'school') as any[]
    const currentYear = currentYearResults[0]

    // Get last year stats (2024)
    const lastYearQuery = `
      SELECT 
        COUNT(DISTINCT a.panNumber) AS totalQualifiers,
        COUNT(DISTINCT CASE WHEN b.paymentStatus = 'paid' THEN a.panNumber END) AS successfulPayments
      FROM ats_qualifiers a 
      LEFT JOIN duketip_registrationDetails b ON a.panNumber = b.panNumber AND b.year = 2024
      WHERE a.schoolcode = ? AND a.programmeDetailID = 101
    `
    
    const lastYearResults = await executeQuery(lastYearQuery, [schoolCode], 'school') as any[]
    const lastYear = lastYearResults[0]

    // Calculate percentages
    const currentPercentage = currentYear.totalQualifiers > 0 
      ? Math.round((currentYear.successfulPayments / currentYear.totalQualifiers) * 100 * 10) / 10
      : 0

    const lastPercentage = lastYear.totalQualifiers > 0
      ? Math.round((lastYear.successfulPayments / lastYear.totalQualifiers) * 100 * 10) / 10
      : 0

    const dashboardData = {
      schoolInfo: {
        code: schoolInfo.schoolno,
        name: schoolInfo.schoolname,
        city: schoolInfo.city
      },
      currentYear: {
        year: 2025,
        qualified: parseInt(currentYear.totalQualifiers),
        registered: parseInt(currentYear.successfulPayments),
        percentage: currentPercentage
      },
      lastYear: {
        year: 2024,
        qualified: parseInt(lastYear.totalQualifiers),
        registered: parseInt(lastYear.successfulPayments),
        percentage: lastPercentage
      }
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Unauthorized or server error' },
      { status: 401 }
    )
  }
} 
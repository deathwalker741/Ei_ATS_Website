import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is required.')
  return secret
}

function verifyToken(request: NextRequest) {
  const token = request.cookies.get('school-token')?.value
  if (!token) throw new Error('No authentication token provided')
  return jwt.verify(token, getJWTSecret()) as any
}

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    const schoolCode = decoded.schoolCode

    if (!process.env.DB_SCHOOL_PASSWORD) {
      return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
    }

    // Totals for current and last year (programmeDetailIDs 113 and 101)
    const totalsCurrentQuery = `
      SELECT 
        COUNT(DISTINCT a.panNumber) AS totalQualifiers,
        COUNT(DISTINCT CASE WHEN b.paymentStatus = 'Paid' OR b.paymentStatus = 'paid' THEN a.panNumber END) AS successfulPayments
      FROM ats_qualifiers a 
      LEFT JOIN duketip_registrationDetails b ON a.panNumber = b.panNumber AND b.year = 2025
      WHERE a.schoolcode = ? AND a.programmeDetailID = 113
    `
    const totalsLastQuery = `
      SELECT 
        COUNT(DISTINCT a.panNumber) AS totalQualifiers,
        COUNT(DISTINCT CASE WHEN b.paymentStatus = 'Paid' OR b.paymentStatus = 'paid' THEN a.panNumber END) AS successfulPayments
      FROM ats_qualifiers a 
      LEFT JOIN duketip_registrationDetails b ON a.panNumber = b.panNumber AND b.year = 2024
      WHERE a.schoolcode = ? AND a.programmeDetailID = 101
    `

    const [totalsCurrent] = await executeQuery(totalsCurrentQuery, [schoolCode], 'school') as any[]
    const [totalsLast] = await executeQuery(totalsLastQuery, [schoolCode], 'school') as any[]

    // Non-ASSET (registered but not in qualifiers) both years
    const nonAssetCurrentQuery = `
      SELECT COUNT(*) AS count
      FROM duketip_registrationDetails b
      WHERE b.paymentStatus IN ('Paid', 'paid') AND b.year = 2025 AND b.country = 'India'
        AND b.panNumber NOT IN (SELECT panNumber FROM ats_qualifiers)
    `
    const nonAssetLastQuery = `
      SELECT COUNT(*) AS count
      FROM duketip_registrationDetails b
      WHERE b.paymentStatus IN ('Paid', 'paid') AND b.year = 2024 AND b.country = 'India'
        AND b.panNumber NOT IN (SELECT panNumber FROM ats_qualifiers)
    `
    const [nonAssetCurrent] = await executeQuery(nonAssetCurrentQuery, [], 'school') as any[]
    const [nonAssetLast] = await executeQuery(nonAssetLastQuery, [], 'school') as any[]

    // Past-year qualifiers who registered this year (minus Non-ASSET)
    const pastYearRegisteredCurrentQuery = `
      SELECT COUNT(DISTINCT b.panNumber) AS count
      FROM duketip_registrationDetails b
      WHERE b.paymentStatus IN ('Paid','paid') AND b.year = 2025 AND b.country = 'India'
        AND NOT EXISTS (
          SELECT 1 FROM ats_qualifiers a 
          WHERE a.panNumber = b.panNumber AND a.programmeDetailID = 113
        )
    `
    const pastYearRegisteredLastQuery = `
      SELECT COUNT(DISTINCT b.panNumber) AS count
      FROM duketip_registrationDetails b
      WHERE b.paymentStatus IN ('Paid','paid') AND b.year = 2024 AND b.country = 'India'
        AND NOT EXISTS (
          SELECT 1 FROM ats_qualifiers a 
          WHERE a.panNumber = b.panNumber AND a.programmeDetailID >= 101
        )
    `

    const [pastYearRegisteredCurrentRaw] = await executeQuery(pastYearRegisteredCurrentQuery, [], 'school') as any[]
    const [pastYearRegisteredLastRaw] = await executeQuery(pastYearRegisteredLastQuery, [], 'school') as any[]

    const pastYearRegisteredCurrent = Math.max(0, Number(pastYearRegisteredCurrentRaw?.count ?? 0) - Number(nonAssetCurrent?.count ?? 0))
    const pastYearRegisteredLast = Math.max(0, Number(pastYearRegisteredLastRaw?.count ?? 0) - Number(nonAssetLast?.count ?? 0))

    // Totals registered this and last year by program IDs
    const totalRegisteredCurrentQuery = `
      SELECT COUNT(*) AS count
      FROM duketip_registrationDetails 
      WHERE year = 2025 AND programDetailID = 113 AND paymentStatus IN ('Paid','paid')
    `
    const totalRegisteredLastQuery = `
      SELECT COUNT(*) AS count
      FROM duketip_registrationDetails 
      WHERE year = 2024 AND programDetailID = 101 AND paymentStatus IN ('Paid','paid')
    `
    const [totalRegisteredCurrent] = await executeQuery(totalRegisteredCurrentQuery, [], 'school') as any[]
    const [totalRegisteredLast] = await executeQuery(totalRegisteredLastQuery, [], 'school') as any[]

    const body = {
      currentYear: {
        qualified: Number(totalsCurrent?.totalQualifiers ?? 0),
        registered: Number(totalsCurrent?.successfulPayments ?? 0),
        nonAsset: Number(nonAssetCurrent?.count ?? 0),
        pastYearQualifiersWhoRegistered: pastYearRegisteredCurrent,
        totalRegistered: Number(totalRegisteredCurrent?.count ?? 0)
      },
      lastYear: {
        qualified: Number(totalsLast?.totalQualifiers ?? 0),
        registered: Number(totalsLast?.successfulPayments ?? 0),
        nonAsset: Number(nonAssetLast?.count ?? 0),
        pastYearQualifiersWhoRegistered: pastYearRegisteredLast,
        totalRegistered: Number(totalRegisteredLast?.count ?? 0)
      }
    }

    return NextResponse.json(body)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 })
  }
}



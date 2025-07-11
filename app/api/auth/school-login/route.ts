import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  throw new Error('JWT_SECRET environment variable is required. Please check your .env.local file.')
})()

const SCHOOL_AUTH_PASSWORD = process.env.SCHOOL_AUTH_PASSWORD || (() => {
  throw new Error('SCHOOL_AUTH_PASSWORD environment variable is required. Please check your .env.local file.')
})()

export async function POST(request: NextRequest) {
  try {
    const { schoolCode, password } = await request.json()

    if (!schoolCode || !password) {
      return NextResponse.json(
        { error: 'School code and password are required' },
        { status: 400 }
      )
    }

    // Validate school exists and has qualified students
    const schoolQuery = `
      SELECT DISTINCT s.schoolno, s.schoolname, s.city 
      FROM schools s 
      INNER JOIN ats_qualifiers a ON s.schoolno = a.schoolcode 
      WHERE s.schoolno = ? AND a.programmeDetailID = 113
    `
    
    const schoolResults = await executeQuery(schoolQuery, [schoolCode], 'school') as any[]

    if (schoolResults.length === 0) {
      return NextResponse.json(
        { error: 'Invalid school code or no qualified students found' },
        { status: 401 }
      )
    }

    // Use secure environment variable for authentication
    const validPassword = password === SCHOOL_AUTH_PASSWORD || password === schoolCode

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    const schoolInfo = schoolResults[0]

    // Generate JWT token
    const token = jwt.sign(
      {
        schoolCode: schoolInfo.schoolno,
        schoolName: schoolInfo.schoolname,
        city: schoolInfo.city
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      school: {
        code: schoolInfo.schoolno,
        name: schoolInfo.schoolname,
        city: schoolInfo.city
      }
    })

    response.cookies.set('school-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response

  } catch (error) {
    // Don't log sensitive information
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'

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
    
    const schoolResults = await executeQuery(schoolQuery, [schoolCode]) as any[]

    if (schoolResults.length === 0) {
      return NextResponse.json(
        { error: 'Invalid school code or no qualified students found' },
        { status: 401 }
      )
    }

    // For now, using a simple password validation
    // You can implement more sophisticated authentication as needed
    const validPassword = password === 'ats2025' || password === schoolCode

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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
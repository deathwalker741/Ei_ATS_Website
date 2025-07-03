import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'

function verifyToken(request: NextRequest) {
  const token = request.cookies.get('school-token')?.value
  if (!token) {
    throw new Error('No token provided')
  }
  
  return jwt.verify(token, JWT_SECRET) as any
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decoded = verifyToken(request)
    const schoolCode = decoded.schoolCode

    // Get detailed student data
    const studentsQuery = `
      SELECT 
        a.panNumber, 
        a.studentName, 
        a.class, 
        a.section, 
        a.schoolcode, 
        a.school_student_id, 
        a.report_access_key, 
        a.epirt, 
        a.mpirt, 
        a.spirt, 
        GROUP_CONCAT(b.paymentStatus) as paymentStatus
      FROM ats_qualifiers a 
      LEFT JOIN duketip_registrationDetails b ON a.panNumber = b.panNumber AND b.year = 2025
      WHERE a.programmeDetailID = 113 AND a.schoolcode = ? 
      GROUP BY a.panNumber 
      ORDER BY a.class, a.section, GREATEST(a.epirt, a.mpirt, a.spirt) DESC
    `
    
    const studentsResults = await executeQuery(studentsQuery, [schoolCode]) as any[]

    // Process student data
    const processedStudents = studentsResults.map((row: any) => {
      const englishPercentile = Math.round(row.epirt * 10) / 10
      const mathsPercentile = Math.round(row.mpirt * 10) / 10  
      const sciencePercentile = Math.round(row.spirt * 10) / 10

      const highestPercentile = Math.max(englishPercentile, mathsPercentile, sciencePercentile)
      
      const highestSubjects = []
      if (englishPercentile === highestPercentile) highestSubjects.push("English")
      if (mathsPercentile === highestPercentile) highestSubjects.push("Maths")
      if (sciencePercentile === highestPercentile) highestSubjects.push("Science")

      const payStatus = row.paymentStatus === null ? 'No' : 
                       (row.paymentStatus && row.paymentStatus.includes('paid')) ? 'Yes' : 'Attempted'

      return {
        panNumber: row.panNumber,
        studentName: row.studentName,
        schoolStudentId: row.school_student_id,
        class: row.class,
        section: row.section,
        classSection: row.class + row.section,
        percentiles: {
          english: englishPercentile,
          maths: mathsPercentile,
          science: sciencePercentile,
          highest: highestPercentile,
          highestSubjects: highestSubjects
        },
        registrationStatus: payStatus,
        isRegistered: payStatus === 'Yes',
        isHighPerformer: highestPercentile >= 90
      }
    })

    // Separate into registered and pending
    const registeredStudents = processedStudents.filter(student => student.isRegistered)
    const pendingStudents = processedStudents.filter(student => !student.isRegistered)

    // Get school info
    const schoolQuery = `SELECT schoolno, schoolname, city FROM schools WHERE schoolno = ?`
    const schoolResults = await executeQuery(schoolQuery, [schoolCode]) as any[]
    const schoolInfo = schoolResults[0]

    const responseData = {
      schoolInfo: {
        code: schoolInfo.schoolno,
        name: schoolInfo.schoolname,
        city: schoolInfo.city
      },
      summary: {
        totalQualifiers: processedStudents.length,
        totalRegistered: registeredStudents.length,
        totalPending: pendingStudents.length,
        percentageRegistered: processedStudents.length > 0 
          ? Math.round((registeredStudents.length / processedStudents.length) * 100)
          : 0
      },
      students: {
        registered: registeredStudents,
        pending: pendingStudents,
        all: processedStudents
      }
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Students API error:', error)
    return NextResponse.json(
      { error: 'Unauthorized or server error' },
      { status: 401 }
    )
  }
} 
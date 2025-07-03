import mysql from 'mysql2/promise'

const dbConfig = {
  host: '10.0.6.122',
  port: 3306,
  user: 'bindu.pillai1',
  password: 'Bindu@2024',
  database: 'educatio_educat',
  charset: 'utf8mb4',
  timezone: '+04:00'
}

let connection: mysql.Connection | null = null

export async function getConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection(dbConfig)
      console.log('Database connected successfully')
    } catch (error) {
      console.error('Database connection failed:', error)
      throw error
    }
  }
  return connection
}

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const conn = await getConnection()
    const [results] = await conn.execute(query, params)
    return results
  } catch (error) {
    console.error('Query execution failed:', error)
    throw error
  }
}

// Types for our data structures
export interface SchoolInfo {
  schoolno: string
  schoolname: string
  city: string
}

export interface StudentData {
  panNumber: string
  studentName: string
  class: string
  section: string
  school_student_id: string
  epirt: number
  mpirt: number
  spirt: number
  paymentStatus: string | null
}

export interface SchoolStats {
  schoolCode: string
  schoolName: string
  city: string
  currentYear: {
    qualified: number
    registered: number
    percentage: number
  }
  lastYear: {
    qualified: number
    registered: number
    percentage: number
  }
} 
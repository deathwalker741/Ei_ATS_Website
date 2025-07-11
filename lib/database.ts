import mysql from 'mysql2/promise'

// Database configuration for ATS Website (forms, general data)
const atsWebsiteConfig = {
  host: process.env.DB_ATS_HOST || '172.16.12.83',
  port: parseInt(process.env.DB_ATS_PORT || '3306'),
  user: process.env.DB_ATS_USER || 'appuser',
  password: process.env.DB_ATS_PASSWORD,
  database: process.env.DB_ATS_DATABASE || 'ats_website',
  charset: 'utf8mb4',
  timezone: '+05:30', // IST
  // Connection pool settings
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  idleTimeout: 300000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

// Database configuration for School Admin Login (legacy system)
const schoolAdminConfig = {
  host: process.env.DB_SCHOOL_HOST || '10.0.6.122',
  port: parseInt(process.env.DB_SCHOOL_PORT || '3306'),
  user: process.env.DB_SCHOOL_USER || 'bindu.pillai1',
  password: process.env.DB_SCHOOL_PASSWORD,
  database: process.env.DB_SCHOOL_DATABASE || 'educatio_educat',
  charset: 'utf8mb4',
  timezone: '+05:30', // IST
  // Connection pool settings
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  idleTimeout: 300000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

// Validate that required environment variables are set
function validateDatabaseConfig() {
  const requiredVars = [
    'DB_ATS_PASSWORD',
    'DB_SCHOOL_PASSWORD'
  ]
  
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. Please check your .env.local file.`)
  }
}

// Validate configuration on module load
validateDatabaseConfig()

let atsPool: mysql.Pool | null = null
let schoolPool: mysql.Pool | null = null

export async function getConnection(dbType: 'ats' | 'school' = 'ats') {
  if (dbType === 'school') {
    if (!schoolPool) {
      try {
        schoolPool = mysql.createPool(schoolAdminConfig)
        console.log('School admin database pool created successfully')
      } catch (error) {
        console.error('School admin database pool creation failed')
        throw error
      }
    }
    return schoolPool
  } else {
    if (!atsPool) {
      try {
        atsPool = mysql.createPool(atsWebsiteConfig)
        console.log('ATS website database pool created successfully')
      } catch (error) {
        console.error('ATS website database pool creation failed:', error)
        throw error
      }
    }
    return atsPool
  }
}

export async function executeQuery(query: string, params: any[] = [], dbType: 'ats' | 'school' = 'ats') {
  const maxRetries = 3
  let lastError: any
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const pool = await getConnection(dbType)
      const [results] = await pool.execute(query, params)
      return results
    } catch (error) {
      lastError = error
      console.error(`Query execution failed (attempt ${attempt}/${maxRetries})`)
      
      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
  
  throw lastError
}

// Graceful shutdown function
export async function closeDatabaseConnections() {
  const promises = []
  
  if (atsPool) {
    promises.push(atsPool.end())
    atsPool = null
  }
  
  if (schoolPool) {
    promises.push(schoolPool.end())
    schoolPool = null
  }
  
  if (promises.length > 0) {
    await Promise.all(promises)
    console.log('Database connections closed gracefully')
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
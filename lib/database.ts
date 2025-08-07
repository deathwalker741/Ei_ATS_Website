// Database connection utility - equivalent to PHP hsdbconnect.cls.php
import * as mysql from 'mysql2/promise';

interface DatabaseResult {
  rows: any[];
  affectedRows: number;
}

class Database {
  private connection: mysql.Connection | null = null;

  async connect(): Promise<void> {
    if (this.connection) return;

    // EXACT same database credentials as PHP system (CONNECTION=2)
    // From ats/asset_talent_search/ATSReportGeneration/otherfiles/hsdbconnect.cls.php lines 39-44
    // Host: 172.16.12.157, User: assetd, Pass: assetd123, DB: educatio_educat
    this.connection = await mysql.createConnection({
      host: '172.16.12.157',        // HARDCODED - Same as PHP $host = "172.16.12.157"
      user: 'assetd',               // HARDCODED - Same as PHP $user = "assetd"  
      password: 'assetd123',        // HARDCODED - Same as PHP $pass = "assetd123"
      database: 'educatio_educat',  // HARDCODED - Same as PHP default database
      timezone: '+00:00',              // Same as PHP
      charset: 'utf8mb4',
    });
  }

  async execute(query: string, params: any[] = []): Promise<DatabaseResult> {
    let connection: mysql.Connection | null = null;
    
    try {
      console.log('🔍 Creating database connection...');
      // Create a fresh connection for each query to avoid connection state issues
      connection = await mysql.createConnection({
        host: '172.16.12.157',
        user: 'assetd',
        password: 'assetd123',
        database: 'educatio_educat',
        timezone: '+00:00',
        charset: 'utf8mb4',
      });
      
      console.log('✅ Database connection established');
      console.log('🔍 Executing query:', query.substring(0, 100) + '...');
      console.log('🔍 Params:', params);

      const [results] = await connection.execute(query, params);
      
      console.log('✅ Query executed successfully');
      console.log('🔍 Results type:', typeof results);
      console.log('🔍 Results is array:', Array.isArray(results));
      console.log('🔍 Results length:', Array.isArray(results) ? results.length : 'N/A');
      
      if (Array.isArray(results)) {
        console.log('✅ Returning array results, length:', results.length);
        return {
          rows: results,
          affectedRows: results.length,
        };
      } else {
        console.log('✅ Returning non-array results');
        return {
          rows: [],
          affectedRows: (results as any).affectedRows || 0,
        };
      }
    } catch (error) {
      console.error('❌ Database query error:', error);
      console.error('❌ Query:', query);
      console.error('❌ Params:', params);
      console.error('❌ Connection state:', connection ? 'exists' : 'null');
      throw error;
    } finally {
      // Always close the connection
      if (connection) {
        console.log('🔐 Closing database connection...');
        try {
          await connection.end();
          console.log('✅ Database connection closed');
        } catch (closeError) {
          console.error('❌ Error closing connection:', closeError);
        }
      }
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}

// Export singleton instance (similar to PHP dbconnect pattern)
export const db = new Database();

// Export executeQuery function for backward compatibility
export const executeQuery = async (query: string, params?: any[]) => {
  return await db.execute(query, params);
};
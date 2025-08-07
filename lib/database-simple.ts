// Simple database connection for debugging
import * as mysql from 'mysql2/promise';

export async function executeSimpleQuery(query: string, params: any[] = []) {
  console.log('🔍 executeSimpleQuery called');
  console.log('Query:', query);
  console.log('Params:', params);
  
  let connection: mysql.Connection | null = null;
  
  try {
    // Create fresh connection
    connection = await mysql.createConnection({
      host: '172.16.12.157',
      user: 'assetd',
      password: 'assetd123',
      database: 'educatio_educat',
      timezone: '+00:00',
      charset: 'utf8mb4',
    });
    
    console.log('✅ Connection created');
    
    // Execute query
    console.log('🔍 About to execute query...');
    const queryResult = await connection.execute(query, params);
    console.log('🔍 Raw query result:', queryResult);
    console.log('🔍 Query result type:', typeof queryResult);
    console.log('🔍 Query result is array:', Array.isArray(queryResult));
    
    if (!queryResult) {
      console.log('❌ Query result is null/undefined');
      return [];
    }
    
    const [results] = queryResult;
    console.log('✅ Query executed');
    console.log('Results type:', typeof results);
    console.log('Results is array:', Array.isArray(results));
    
    if (Array.isArray(results)) {
      console.log('Results length:', results.length);
      console.log('First result:', results[0]);
      return results;
    } else {
      console.log('Non-array results:', results);
      return [];
    }
    
  } catch (error) {
    console.error('❌ Query error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Connection closed');
    }
  }
}
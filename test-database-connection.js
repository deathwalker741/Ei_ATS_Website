// Test database connection and check for PAN 828603656
const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  let connection;
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Same credentials as in database.ts
    connection = await mysql.createConnection({
      host: '172.16.12.157',
      user: 'assetd', 
      password: 'assetd123',
      database: 'educatio_educat',
      timeout: 10000
    });

    console.log('✅ Database connection successful!');

    // Test 1: Check if ats_qualifiers table exists
    console.log('\n📋 Testing tables...');
    
    const [tables] = await connection.execute("SHOW TABLES LIKE 'ats_qualifiers'");
    console.log('ats_qualifiers table exists:', tables.length > 0);

    if (tables.length > 0) {
      // Test 2: Check for specific PAN 828603656
      console.log('\n🔍 Searching for PAN 828603656...');
      
      const [panResults] = await connection.execute(
        "SELECT * FROM ats_qualifiers WHERE panNumber = ?", 
        ['828603656']
      );
      
      console.log('Records found for PAN 828603656:', panResults.length);
      
      if (panResults.length > 0) {
        console.log('✅ PAN found! Data:', panResults[0]);
      } else {
        console.log('❌ PAN not found in ats_qualifiers');
        
        // Check all PANs in table
        const [allPans] = await connection.execute(
          "SELECT panNumber, firstName, lastName FROM ats_qualifiers LIMIT 10"
        );
        console.log('\n📊 Sample PANs in database:');
        allPans.forEach(row => {
          console.log(`  PAN: ${row.panNumber}, Name: ${row.firstName} ${row.lastName}`);
        });
      }
    }

    // Test 3: Check duketip_registrationDetails table
    console.log('\n📋 Checking duketip_registrationDetails...');
    const [regTables] = await connection.execute("SHOW TABLES LIKE 'duketip_registrationDetails'");
    console.log('duketip_registrationDetails table exists:', regTables.length > 0);

    if (regTables.length > 0) {
      const [regResults] = await connection.execute(
        "SELECT * FROM duketip_registrationDetails WHERE panNumber = ?", 
        ['828603656']
      );
      console.log('Records in duketip_registrationDetails for PAN:', regResults.length);
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🚨 Connection refused - database server might be down or credentials wrong');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🚨 Access denied - wrong username/password');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🚨 Host not found - wrong host address');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testDatabaseConnection();
// Check programme details for 2025
const mysql = require('mysql2/promise');

async function checkProgrammeDetails() {
  let connection;
  
  try {
    console.log('🔍 Checking programme details for 2025...');
    
    connection = await mysql.createConnection({
      host: '172.16.12.157',
      user: 'assetd', 
      password: 'assetd123',
      database: 'educatio_educat'
    });

    // Check current programme details for 2025
    const programmeQuery = `
      SELECT programmeDetailid, country, year, programmeID
      FROM gec_programmeDetails 
      WHERE programmeID = 11 AND year >= (2025-5) 
      ORDER BY year DESC, country
    `;

    const [programmeRows] = await connection.execute(programmeQuery);
    
    console.log('📊 Programme Details:');
    programmeRows.forEach(row => {
      console.log(`  ID: ${row.programmeDetailid}, Country: ${row.country}, Year: ${row.year}, ProgrammeID: ${row.programmeID}`);
    });

    // Check what programme ID the student has
    const studentQuery = `
      SELECT panNumber, firstName, lastName, programmeDetailID, year
      FROM ats_qualifiers 
      WHERE panNumber = 828603656
    `;

    const [studentRows] = await connection.execute(studentQuery);
    
    console.log('\n👤 Student Details:');
    studentRows.forEach(row => {
      console.log(`  PAN: ${row.panNumber}, Name: ${row.firstName} ${row.lastName}, ProgrammeDetailID: ${row.programmeDetailID}, Year: ${row.year}`);
    });

    // Check if student's programme ID is in the valid list
    const validIds = programmeRows
      .filter(row => row.country === 'INDIA')
      .map(row => row.programmeDetailid.toString());
    
    const studentProgrammeId = studentRows[0]?.programmeDetailID?.toString();
    
    console.log('\n🔍 Eligibility Check:');
    console.log('Valid India Programme IDs:', validIds);
    console.log('Student Programme ID:', studentProgrammeId);
    console.log('Is Eligible:', validIds.includes(studentProgrammeId) ? 'YES' : 'NO');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkProgrammeDetails();
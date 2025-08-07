// Direct test of PAN validation logic
const { ClsDuketip } = require('./lib/classes/eiduketip.ts');

async function testPanValidation() {
  try {
    console.log('🔍 Testing PAN validation directly...');
    
    const clsduketip = new ClsDuketip();
    clsduketip.panNumber = '828603656';
    clsduketip.country = 'India';
    
    console.log('Input PAN:', clsduketip.panNumber);
    console.log('Input Country:', clsduketip.country);
    
    const result = await clsduketip.getSchoolDetailsByPanAjax();
    
    console.log('✅ Result:', result);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPanValidation();
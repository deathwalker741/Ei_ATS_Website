// Test script to verify PAN validation API
const fetch = require('node-fetch');

async function testPANValidation() {
  try {
    console.log('Testing PAN validation API...');
    
    const response = await fetch('http://localhost:3000/api/registration/validate-pan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        panNumber: '123456789',  // Test PAN
        country: 'India'
      }),
    });

    const result = await response.json();
    console.log('API Response:', result);
    
    if (response.ok) {
      console.log('✅ API is working');
      if (result.valid === '1') {
        console.log('✅ PAN validation successful');
        console.log('Student data:', {
          name: `${result.firstName} ${result.lastName}`,
          school: result.school_full_name,
          class: result.class
        });
      } else {
        console.log('❌ PAN not found in database');
      }
    } else {
      console.log('❌ API error:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPANValidation();
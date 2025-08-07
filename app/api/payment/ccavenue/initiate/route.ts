// CCAvenue payment initiation - EXACT port from asset_talent_search_order.php
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { ClsDuketip } from '@/lib/classes/eiduketip';
import { encrypt, CCAVENUE_CONFIG, cleanSpecialChars, cleanPhoneNumber } from '@/lib/payment/ccavenue-crypto';

// Fee constants - EXACT same as PHP constants.php
const ATS_DUBAI_EARLYBIRD_FEES = 270; // ATS_DUBAI_EARLYBIRD_FEES from line 53
const ATS_USD_AMOUNT = 75; // ATS_USD_AMOUNT from line 47

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json();
    
    if (!orderID) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Get registration details from database
    const clsduketip = new ClsDuketip();
    await clsduketip.connect();
    
    // Get student details by order ID - equivalent to PHP $clsduketip object population
    const query = `
      SELECT firstName, lastName, address, city, country, parentCell, parentEmail
      FROM duketip_registrationDetails 
      WHERE orderID = ? AND year = 2025
    `;
    
    const result = await db.execute(query, [orderID]);
    
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const studentData = result.rows[0] as any;
    
    // Determine which CCAvenue account to use based on country
    // EXACT same logic as PHP asset_talent_search_order.php lines 283-344
    let ccavenueConfig;
    let amount: number;
    let currency: string;
    let billingCity: string;
    let billingCountry: string;
    
    if (studentData.country === "United Arab Emirates") {
      // UAE CCAvenue Account - lines 290-342 in PHP
      ccavenueConfig = CCAVENUE_CONFIG.UAE;
      amount = ATS_DUBAI_EARLYBIRD_FEES; // Line 295: $ats_dubai_fees = constant("ATS_DUBAI_EARLYBIRD_FEES");
      currency = "AED"; // Line 306
      billingCity = "Dubai"; // Line 320: hardcoded in PHP
      billingCountry = "United Arab Emirates"; // Line 323
    } else {
      // International CCAvenue Account - lines 344-400 in PHP  
      ccavenueConfig = CCAVENUE_CONFIG.INTERNATIONAL;
      amount = ATS_USD_AMOUNT; // Line 366: $ats_other_country_fees = constant("ATS_USD_AMOUNT");
      currency = "USD"; // Line 369
      billingCity = cleanSpecialChars(studentData.city); // Line 381: uses actual city
      billingCountry = cleanSpecialChars(studentData.country); // Line 384: uses actual country
    }

    // Build merchant data string - EXACT same format as PHP lines 292-330 & 363-391
    let merchantData = "";
    
    // Compulsory fields
    merchantData += `merchant_id=${ccavenueConfig.MERCHANT_ID}`;
    merchantData += `&order_id=${orderID}`;
    merchantData += `&amount=${amount}`;
    merchantData += `&currency=${currency}`;
    merchantData += `&redirect_url=${ccavenueConfig.RETURN_URL}`;
    merchantData += `&cancel_url=${ccavenueConfig.RETURN_URL}`;
    merchantData += "&language=EN";
    
    // Optional fields - EXACT same cleaning as PHP
    const billingName = cleanSpecialChars(`${studentData.firstName} ${studentData.lastName}`);
    const billingAddress = cleanSpecialChars(studentData.address);
    const billingTel = cleanPhoneNumber(studentData.parentCell);
    const billingEmail = cleanSpecialChars(studentData.parentEmail);
    
    merchantData += `&billing_name=${billingName}`;
    merchantData += `&billing_address=${billingAddress}`;
    merchantData += `&billing_city=${billingCity}`;
    merchantData += `&billing_country=${billingCountry}`;
    merchantData += `&billing_tel=${billingTel}`;
    merchantData += `&billing_email=${billingEmail}`;
    
    // Insert transaction record - EXACT same as PHP line 331 & 392
    await clsduketip.insertTransaction(orderID, amount.toString(), '', '', '', merchantData);
    
    // Encrypt merchant data - EXACT same as PHP line 333 & 393
    const encryptedData = encrypt(merchantData, ccavenueConfig.WORKING_KEY);
    
    // Return form data for auto-submission - EXACT same as PHP lines 336-339 & 396-399
    return NextResponse.json({
      action: ccavenueConfig.URL,
      encRequest: encryptedData,
      access_code: ccavenueConfig.ACCESS_CODE,
      merchantData, // For debugging (remove in production)
      country: studentData.country,
      amount,
      currency
    });
    
  } catch (error) {
    console.error('CCAvenue initiation error:', error);
    return NextResponse.json(
      { error: 'Payment initiation failed' },
      { status: 500 }
    );
  }
}

// Generate HTML form for auto-submission - EXACT same as PHP
export function generateCCavenueForm(
  action: string,
  encRequest: string,
  accessCode: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting to Payment Gateway...</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .loading { font-size: 18px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="loading">
        L O A D I N G..................<br><br>
        Please do not press Back or Refresh<br>
        Transferring you to secure payment gateway
    </div>
    
    <form name="regform" method="POST" action="${action}" id="ccavenueForm">
        <input type="hidden" name="encRequest" value="${encRequest}">
        <input type="hidden" name="access_code" value="${accessCode}">
    </form>
    
    <script>
        function register() {
            document.getElementById('ccavenueForm').submit();
        }
        // Auto-submit after 1 second - same as PHP
        setTimeout(function(){ register(); }, 1000);
    </script>
</body>
</html>`;
}
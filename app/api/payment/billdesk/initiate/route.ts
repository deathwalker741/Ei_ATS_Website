import { NextRequest, NextResponse } from 'next/server';
import { ClsDuketip } from '@/lib/classes/eiduketip';
import { createHmac } from 'crypto';

/**
 * BillDesk Payment Initiation - EXACT same as PHP asset_talent_search_order.php lines 214-268
 * This endpoint handles the initiation of BillDesk payments for Indian students
 */

// BillDesk constants - EXACT same as PHP lines 39-42
const BILLDESK_CONFIG = {
  MERCHANT_ID: "EDUINPL",
  GATEWAY_URI: "https://www.billdesk.com/pgidsk/PGIMerchantPayment",
  SECURITY_ID: "eduinpl",
  CHECKSUM_KEY: "XfpsuCwstgti"
};

// Return URL - EXACT same as PHP constant ATS_PAYMENT_RETURN_URL
const ATS_PAYMENT_RETURN_URL = process.env.NODE_ENV === 'production' 
  ? "https://ats.ei.study/api/payment/callback"
  : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment/callback`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderID = searchParams.get('orderID');
    
    if (!orderID) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // Get order details from database - EXACT same as PHP
    const clsDuketip = new ClsDuketip();
    await clsDuketip.getDataFromOrderID(orderID);
    
    // Clean special characters - EXACT same as PHP lines 243-245
    const pattern = /[^a-zA-Z0-9\-_.@ ]/g;
    const replacement = '';
    
    // Build customer data - EXACT same as PHP lines 247-252
    const billing_cust_name = `${clsDuketip.firstName} ${clsDuketip.lastName}`.replace(pattern, replacement);
    const billing_cust_address = (clsDuketip.city || '').replace(pattern, replacement);
    const billing_cust_country = (clsDuketip.country || '').replace(pattern, replacement);
    const billing_cust_email = (clsDuketip.parentEmail || '').replace(pattern, replacement);
    const billing_cust_tel = (clsDuketip.parentCell || '').replace(/[^0-9]/g, '');
    
    // Amount - EXACT same as PHP logic
    const Amount = clsDuketip.amount;
    
    // Create Order ID - EXACT same as PHP lines 30-34
    const Order_Id = clsDuketip.student_type === "Gifted" 
      ? `GTS${Date.now()}${clsDuketip.orderID}`
      : `ATS${Date.now()}${clsDuketip.orderID}`;
    
    // Update order ID in database
    await clsDuketip.setOrderID(Order_Id, clsDuketip.orderID, clsDuketip.student_type);
    
    // Build message - EXACT same as PHP line 255
    let msg = `${BILLDESK_CONFIG.MERCHANT_ID}|${Order_Id}|NA|${Amount}|NA|NA|NA|INR|NA|R|${BILLDESK_CONFIG.SECURITY_ID}|NA|NA|F|${billing_cust_name}|${billing_cust_email}|${billing_cust_tel}|${billing_cust_country}|NA|NA|NA|${ATS_PAYMENT_RETURN_URL}`;
    
    // Replace empty fields - EXACT same as PHP line 256
    msg = msg.replace(/\|\|/g, '|NA|');
    
    // Generate checksum - EXACT same as PHP line 258: strtoupper(hash_hmac('sha256',$msg,constant('CHECKSUM_KEY'), false))
    const checkSum = createHmac('sha256', BILLDESK_CONFIG.CHECKSUM_KEY)
      .update(msg)
      .digest('hex')
      .toUpperCase();
    
    // Final message - EXACT same as PHP line 259
    const finalMsg = `${msg}|${checkSum}`;
    
    // Insert transaction - EXACT same as PHP line 260
    await clsDuketip.insertTransaction(Order_Id, Amount);
    
    // Return HTML form that auto-submits - EXACT same as PHP lines 263-267
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>ASSET Talent Search Order Submit</title>
  <script>
    function register() {
      document.regform.submit();
    }
  </script>
</head>
<body>
  <div style="text-align: center; margin-top: 50px;">
    <h3>L O A D I N G..................</h3>
    <p>Please do not press Back or Refresh<br>Transferring you to secure payment gateway</p>
  </div>
  <form name="regform" method="POST" action="${BILLDESK_CONFIG.GATEWAY_URI}">
    <input type="hidden" name="msg" value="${finalMsg}">
  </form>
  <script>register();</script>
</body>
</html>`;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error) {
    console.error('BillDesk initiation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
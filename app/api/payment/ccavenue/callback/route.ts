// CCAvenue payment callback handler - EXACT port from asset_talent_search_ccavenue_order_save.php
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { ClsDuketip } from '@/lib/classes/eiduketip';
import { decrypt, CCAVENUE_CONFIG } from '@/lib/payment/ccavenue-crypto';
import { updatePaymentStatus, updateEmailMobileInQualifiers, updateZohoDealInfo } from '@/lib/database/payment-operations';
import { sendEmailOrderConfirm } from '@/lib/email/order-confirmation';
import { recordPaymentFailure } from '@/lib/database/failure-operations';

export async function POST(request: NextRequest) {
  try {
    // Get form data from CCAvenue - EXACT same as PHP lines 81-82
    const formData = await request.formData();
    const encResponse = formData.get('encResp')?.toString() || '';
    const orderNo = formData.get('orderNo')?.toString() || '';
    
    if (!encResponse) {
      return new NextResponse('Invalid response from payment gateway', { status: 400 });
    }

    // Initialize variables - EXACT same as PHP lines 87-96
    let order_id = '', tracking_id = '', bank_ref_no = '', order_status = '', failure_message = '';
    let payment_mode = '', card_name = '', status_code = '', status_message = '', currency = '', amount = '';
    let billing_name = '', billing_address = '', billing_city = '', billing_state = '', billing_zip = '';
    let billing_country = '', billing_tel = '', billing_email = '';
    let delivery_name = '', delivery_address = '', delivery_city = '', delivery_state = '', delivery_zip = '';
    let delivery_country = '', delivery_tel = '';
    let merchant_param1 = '', merchant_param2 = '', merchant_param3 = '', merchant_param4 = '', merchant_param5 = '';
    let vault = '', offer_type = '', offer_code = '', discount_value = '', mer_amount = '';
    let eci_value = '', card_holder_name = '', bank_receipt_no = '', merchant_param6 = '';
    
    let transactionReason = '';
    let rcvdString = '';

    const clsduketip = new ClsDuketip();
    await clsduketip.connect();
    
    // Get country from order ID - EXACT same as PHP line 98
    const getCountry = await clsduketip.getCountryFromOrderID(orderNo);
    
    // Decrypt response using appropriate key - EXACT same as PHP lines 100-104
    if (getCountry?.trim() === 'United Arab Emirates') {
      rcvdString = decrypt(encResponse, CCAVENUE_CONFIG.UAE.WORKING_KEY);
    } else {
      rcvdString = decrypt(encResponse, CCAVENUE_CONFIG.INTERNATIONAL.WORKING_KEY);
    }
    
    // Parse decrypted values - EXACT same as PHP lines 105-158
    const decryptValues = rcvdString.split('&');
    const dataSize = decryptValues.length;
    
    // Extract all variables - EXACT same parsing as PHP lines 114-158
    for (let i = 0; i < dataSize; i++) {
      const information = decryptValues[i].split('=');
      
      if (i === 0) order_id = information[1]?.trim() || '';
      if (i === 1) tracking_id = information[1]?.trim() || '';
      if (i === 2) bank_ref_no = information[1]?.trim() || '';
      if (i === 3) order_status = information[1]?.trim() || '';
      if (i === 4) failure_message = information[1]?.trim() || '';
      if (i === 5) payment_mode = information[1]?.trim() || '';
      if (i === 6) card_name = information[1]?.trim() || '';
      if (i === 7) status_code = information[1]?.trim() || '';
      if (i === 8) status_message = information[1]?.trim() || '';
      if (i === 9) currency = information[1]?.trim() || '';
      if (i === 10) amount = information[1]?.trim() || '';
      if (i === 11) billing_name = information[1]?.trim() || '';
      if (i === 12) billing_address = information[1]?.trim() || '';
      if (i === 13) billing_city = information[1]?.trim() || '';
      if (i === 14) billing_state = information[1]?.trim() || '';
      if (i === 15) billing_zip = information[1]?.trim() || '';
      if (i === 16) billing_country = information[1]?.trim() || '';
      if (i === 17) billing_tel = information[1]?.trim() || '';
      if (i === 18) billing_email = information[1]?.trim() || '';
      if (i === 19) delivery_name = information[1]?.trim() || '';
      if (i === 20) delivery_address = information[1]?.trim() || '';
      if (i === 21) delivery_city = information[1]?.trim() || '';
      if (i === 22) delivery_state = information[1]?.trim() || '';
      if (i === 23) delivery_zip = information[1]?.trim() || '';
      if (i === 24) delivery_country = information[1]?.trim() || '';
      if (i === 25) delivery_tel = information[1]?.trim() || '';
      if (i === 26) merchant_param1 = information[1]?.trim() || '';
      if (i === 27) merchant_param2 = information[1]?.trim() || '';
      if (i === 28) merchant_param3 = information[1]?.trim() || '';
      if (i === 29) merchant_param4 = information[1]?.trim() || '';
      if (i === 30) merchant_param5 = information[1]?.trim() || '';
      if (i === 31) vault = information[1]?.trim() || '';
      if (i === 32) offer_type = information[1]?.trim() || '';
      if (i === 33) offer_code = information[1]?.trim() || '';
      if (i === 34) discount_value = information[1]?.trim() || '';
      if (i === 35) mer_amount = information[1]?.trim() || '';
      if (i === 36) eci_value = information[1]?.trim() || '';
      if (i === 37) card_holder_name = information[1]?.trim() || '';
      if (i === 38) bank_receipt_no = information[1]?.trim() || '';
      if (i === 39) merchant_param6 = information[1]?.trim() || '';
    }
    
    // Set transaction ID - EXACT same as PHP line 161
    const transactionID = tracking_id || '';
    
    // Build transaction reason - EXACT same as PHP lines 163-165
    if (failure_message) transactionReason += failure_message + '<br>';
    if (status_message) transactionReason += status_message + '<br>';
    if (status_code) transactionReason += 'Status Code:' + status_code + '<br>';
    
    // Update transaction status - EXACT same as PHP line 168
    let transactionStatusUpdate = false;
    if (order_id) {
      transactionStatusUpdate = await clsduketip.updateTransactionStatus(
        order_status,
        transactionID,
        order_id,
        transactionReason,
        rcvdString,
        amount
      );
    }
    
    // Handle successful payment - EXACT same as PHP lines 170-210
    if (order_status === 'Success' && transactionStatusUpdate) {
      // Update registration details - EXACT same as PHP lines 172-176
      const updateQuery = `
        UPDATE duketip_registrationDetails 
        SET paymentStatus = 'paid', 
            acctCreditedDate = CURDATE(),
            modified_date = NOW(), 
            modified_by = 'PaymentGateway'
        WHERE orderID = ?
      `;
      
      await db.execute(updateQuery, [order_id]);
      
      // Send confirmation email - EXACT same as PHP line 177
      await sendEmailOrderConfirm(order_id);
      
      // Update qualifiers - EXACT same as PHP line 178
      await updateEmailMobileInQualifiers(order_id);
      
      // Update Zoho (only in live) - EXACT same as PHP lines 179-181
      const serverType = process.env.SERVER_TYPE || 'Live';
      if (serverType === 'Live') {
        await updateZohoDealInfo(order_id);
      }
      
      // Return success page - EXACT same content as PHP lines 189-209
      return new NextResponse(generateSuccessPageHTML(getCountry), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, must-revalidate'
        }
      });
    }
    // Handle aborted payment - EXACT same as PHP lines 212-232
    else if (order_status === 'Aborted') {
      await recordPaymentFailure(order_id, order_status);
      
      return new NextResponse(generateAbortedPageHTML(getCountry), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, must-revalidate'
        }
      });
    }
    // Handle failed payment - EXACT same as PHP lines 234-280
    else {
      await recordPaymentFailure(order_id, 'Error/Decline');
      
      return new NextResponse(generateFailurePageHTML(getCountry), {
        headers: {
          'Content-Type': 'text/html', 
          'Cache-Control': 'no-cache, must-revalidate'
        }
      });
    }
    
  } catch (error) {
    console.error('CCAvenue callback error:', error);
    return new NextResponse('Payment processing failed', { status: 500 });
  }
}

/**
 * Generate success page HTML - EXACT same content as PHP lines 189-209
 */
function generateSuccessPageHTML(country?: string): string {
  const email = country === 'United Arab Emirates' ? 'atsdubai@ei.study' : 'atsinternational@ei.study';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>EI - ASSET Talent Search Registration</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.css" type="text/css" />
    <link rel="stylesheet" href="/css/reset.css" type="text/css" />
    <link rel="stylesheet" href="/css/style_old.css" type="text/css" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    
    <!-- Google Tag Manager -->
    <script>
      dataLayer = [];
      window.dataLayer = window.dataLayer || [];
    </script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-NG482KJ');</script>
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NG482KJ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    
    <div class="container-fluid">
        <div class="row">
            <div class="col-xs-1"></div>
            <div class="col-xs-10"></div>
            <div class="col-xs-1"></div>
        </div>
        <div class="row text-center">
            <div class="col-xs-12 orange">Congratulations! Your child's wonderful journey of self-discovery has now begun.</div>
        </div>
        <div class="row text-center black-small">
            <div class="col-xs-12">
                Registration was successful. You will shortly receive a confirmation email from us.<br><br>
                If you don't receive a confirmation email within 7 days, please email us at <a href="mailto:${email}">${email}</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate aborted page HTML - EXACT same content as PHP lines 216-231
 */
function generateAbortedPageHTML(country?: string): string {
  const email = country === 'United Arab Emirates' ? 'atsdubai@ei.study' : 'atsinternational@ei.study';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>EI - ASSET Talent Search Registration</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.css" type="text/css" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-xs-1"></div>
            <div class="col-xs-10"></div>
            <div class="col-xs-1"></div>
        </div>
        <div class="row text-center black-small">
            <div class="col-xs-12">
                Your attempt to register for ASSET Talent Search has failed.<br><br>
                To ensure your registration is complete visit the registration page again. For any assistance please contact our customer support at <a href="mailto:${email}">${email}</a><br/>or<br/>call at +971 56 333 7645.
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate failure page HTML - EXACT same content as PHP lines 247-280
 */
function generateFailurePageHTML(country?: string): string {
  const email = country === 'United Arab Emirates' ? 'atsdubai@ei.study' : 'atsinternational@ei.study';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>EI - ASSET Talent Search Registration</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.css" type="text/css" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-xs-1"></div>
            <div class="col-xs-10"></div>
            <div class="col-xs-1"></div>
        </div>
        <div class="row text-center black-small">
            <div class="col-xs-12">
                Thank you for your time for registering to ASSET Talent Search. However, the transaction has been declined<br><br>
                For any clarifications, please contact us at <a href="mailto:${email}">${email}</a> or call us at 079-40269671/22.
            </div>
        </div>
    </div>
</body>
</html>`;
}
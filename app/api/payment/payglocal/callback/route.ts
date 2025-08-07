// PayGlocal payment callback handler - EXACT port from asset_talent_search_pgl_order_save.php
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { ClsDuketip } from '@/lib/classes/eiduketip';
import { updateEmailMobileInQualifiers } from '@/lib/database/payment-operations';
import { sendEmailOrderConfirm } from '@/lib/email/order-confirmation';
import { recordPaymentFailure } from '@/lib/database/failure-operations';

export async function POST(request: NextRequest) {
  try {
    // Get PayGlocal token from request - EXACT same as PHP lines 39-52
    const formData = await request.formData();
    const token = formData.get('x-gl-token')?.toString();
    
    if (!token) {
      return new NextResponse('Missing PayGlocal token', { status: 400 });
    }

    // Parse JWT token - EXACT same logic as PHP lines 42-52
    const delimiter = ".";
    const parts = token.split(delimiter);
    
    if (parts.length < 2) {
      return new NextResponse('Invalid PayGlocal token format', { status: 400 });
    }
    
    const middlePart = parts[1];
    
    // Replace URL-safe characters - EXACT same as PHP lines 47-48
    const replacementArray: { [key: string]: string } = { "-": "+", "_": "/" };
    let replacedEncodedStr = middlePart;
    for (const [search, replace] of Object.entries(replacementArray)) {
      replacedEncodedStr = replacedEncodedStr.replace(new RegExp(search, 'g'), replace);
    }
    
    // Decode base64 - EXACT same as PHP line 50
    const decodedStr = Buffer.from(replacedEncodedStr, 'base64').toString('utf-8');
    
    // Parse JSON result - EXACT same as PHP line 52
    const result = JSON.parse(decodedStr);
    
    const clsduketip = new ClsDuketip();
    await clsduketip.connect();
    
    // Get country from order ID - EXACT same as PHP line 58
    const getCountry = await clsduketip.getCountryFromOrderID(result.merchantTxnId);
    
    // Extract payment details - EXACT same as PHP lines 61-76
    const order_id = result.merchantTxnId;
    const tracking_id = result.gid;
    const order_status = result.status;
    const payment_mode = result.paymentMethod;
    const amount = result.Amount;
    const rcvdString = result.statusUrl || '';
    
    // Set transaction details - EXACT same as PHP lines 79-84
    const transactionID = tracking_id || '';
    let transactionReason = '';
    
    // Build transaction reason (PHP doesn't add much for PayGlocal)
    if (result.failureMessage) {
      transactionReason += result.failureMessage + '<br>';
    }
    
    // Update transaction status - EXACT same as PHP lines 86-88
    let transactionStatusUpdate = false;
    if (order_id) {
      transactionStatusUpdate = await clsduketip.updateTransactionStatus(
        order_status,
        transactionID,
        order_id,
        transactionReason,
        rcvdString,
        amount?.toString() || '0'
      );
    }
    
    // Handle successful payment - EXACT same as PHP lines 90-143
    if (order_status === 'SENT_FOR_CAPTURE' && transactionStatusUpdate) {
      // Update registration details - EXACT same as PHP lines 92-96
      const updateQuery = `
        UPDATE duketip_registrationDetails 
        SET paymentStatus = 'paid', 
            acctCreditedDate = CURDATE(),
            modified_date = NOW(), 
            modified_by = 'PaymentGateway'
        WHERE orderID = ?
      `;
      
      await db.execute(updateQuery, [order_id]);
      
      // Send confirmation email - EXACT same as PHP line 97
      await sendEmailOrderConfirm(order_id);
      
      // Update qualifiers - EXACT same as PHP line 98
      await updateEmailMobileInQualifiers(order_id);
      
      // Return success page - EXACT same content as PHP lines 101-142
      return new NextResponse(generatePayGlocalSuccessPageHTML(), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, must-revalidate'
        }
      });
    }
    // Handle cancelled payment - EXACT same as PHP lines 145-208
    else if (order_status === 'CUSTOMER_CANCELLED') {
      await recordPaymentFailure(order_id, order_status);
      
      return new NextResponse(generatePayGlocalCancelledPageHTML(), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, must-revalidate'
        }
      });
    }
    // Handle failed payment - EXACT same as PHP lines 210+
    else {
      await recordPaymentFailure(order_id, 'PayGlocal_Error');
      
      return new NextResponse(generatePayGlocalFailurePageHTML(), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, must-revalidate'
        }
      });
    }
    
  } catch (error) {
    console.error('PayGlocal callback error:', error);
    return new NextResponse('Payment processing failed', { status: 500 });
  }
}

/**
 * Generate success page HTML - EXACT same content as PHP lines 101-142
 */
function generatePayGlocalSuccessPageHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>ASSET Talent Search Registration - International</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.css" type="text/css" />
    <link rel="stylesheet" href="/css/reset.css" type="text/css" />
    <link rel="stylesheet" href="/css/style_old.css" type="text/css" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
</head>
<body>
    <div class="container-fluid">
        <!-- header -->
        <header>
            <div class="row">
                <div class="col-xs-1"></div>
                <div class="col-xs-10 pad0">
                    <div class="row">
                        <div class="col-xs-3 pad0">
                            <a href="https://ats.ei.study/">
                                <img src="/assets/img/ats_logo_2025.png" class="img-responsive" />
                            </a>
                        </div>
                        <div class="col-xs-6"></div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="col-md-1"></div>
            </div>
        </header>
        <!-- header end -->
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
                If you don't receive a confirmation email within 7 days, please email us at <a href="mailto:atsinternational@ei.study">atsinternational@ei.study</a>
            </div>
            <div>As an Ei ATS Registrant, you can now benefit from a <a href="https://www.giftedworld.org/" target="_blank">Gifted World</a> membership - To know more, click <a href="https://www.giftedworld.org/gifted-world-for-ats" target="_blank">here</a></div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate cancelled page HTML - EXACT same content as PHP lines 149-208
 */
function generatePayGlocalCancelledPageHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>ASSET Talent Search Registration - International</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.css" type="text/css" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
</head>
<body>
    <div class="container-fluid">
        <header>
            <div class="row">
                <div class="col-xs-1"></div>
                <div class="col-xs-10 pad0">
                    <div class="row">
                        <div class="col-xs-3 pad0">
                            <a href="https://ats.ei.study/">
                                <img src="/assets/img/ats_logo_2025.png" class="img-responsive" />
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-1"></div>
            </div>
        </header>
        <div class="row text-center black-small">
            <div class="col-xs-12">
                Your attempt to register for ASSET Talent Search has been cancelled.<br><br>
                To ensure your registration is complete visit the registration page again. For any assistance please contact our customer support at <a href="mailto:atsinternational@ei.study">atsinternational@ei.study</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate failure page HTML
 */
function generatePayGlocalFailurePageHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>ASSET Talent Search Registration - International</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.css" type="text/css" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
</head>
<body>
    <div class="container-fluid">
        <header>
            <div class="row">
                <div class="col-xs-1"></div>
                <div class="col-xs-10 pad0">
                    <div class="row">
                        <div class="col-xs-3 pad0">
                            <a href="https://ats.ei.study/">
                                <img src="/assets/img/ats_logo_2025.png" class="img-responsive" />
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-1"></div>
            </div>
        </header>
        <div class="row text-center black-small">
            <div class="col-xs-12">
                Thank you for your time for registering to ASSET Talent Search. However, the transaction has been declined<br><br>
                For any clarifications, please contact us at <a href="mailto:atsinternational@ei.study">atsinternational@ei.study</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}
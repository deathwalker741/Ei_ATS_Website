// PayGlocal payment initiation - EXACT port from atsAjaxCall.php HitPayGLocal operation
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { ClsDuketip } from '@/lib/classes/eiduketip';

// PayGlocal constants - EXACT same as PHP constants.php lines 433-440
const PAYGLOCAL_CONFIG = {
  APIKEY: "cGxlZHVpbml0aWF0aXZlOmtJZC1YZTFhdUdRVVBnV2laS0tO",
  URL: "https://api.prod.payglocal.in/gl/v1/payments/initiate/paycollect",
  RETURN_URL: process.env.NODE_ENV === 'production' 
    ? "https://ats.ei.study/api/payment/payglocal/callback"
    : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment/payglocal/callback`,
  AGENT_SCID: "sc_EOZME1BP66LG"
};

export async function POST(request: NextRequest) {
  try {
    const { 
      orderID, 
      Amount, 
      parentEmail, 
      parentCell, 
      parentstdCode, 
      currency, 
      ocRequestID 
    } = await request.json();
    
    if (!orderID || !Amount || !parentEmail || !parentCell) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Clean input data - EXACT same as PHP lines 449-454
    const pattern = /[^a-zA-Z0-9\-_.@ ]/g;
    const phonePattern = /[^0-9]/g;
    
    const billing_cust_email = parentEmail.replace(pattern, '');
    const billing_cust_tel = parentCell.replace(phonePattern, '');
    const billing_cust_stdcode = parentstdCode || '';

    // Prepare headers - EXACT same as PHP lines 456-459
    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-gl-auth': PAYGLOCAL_CONFIG.APIKEY
    };

    // Prepare customer data - EXACT same structure as PHP lines 460-472
    const customer_data = {
      merchantTxnId: orderID,
      paymentData: {
        totalAmount: Amount,
        txnCurrency: currency || 'USD',
        billingData: {
          emailId: billing_cust_email,
          callingCode: billing_cust_stdcode,
          phoneNumber: billing_cust_tel
        }
      },
      riskData: {
        ocRequestId: ocRequestID || ''
      },
      merchantCallbackURL: PAYGLOCAL_CONFIG.RETURN_URL
    };

    // Insert transaction record - EXACT same as PHP line 476
    const clsduketip = new ClsDuketip();
    await clsduketip.connect();
    await clsduketip.insertTransaction(
      orderID, 
      Amount.toString(), 
      '', 
      '', 
      '', 
      JSON.stringify(customer_data)
    );

    // Make API call to PayGlocal - EXACT same as PHP lines 478-493
    const response = await fetch(PAYGLOCAL_CONFIG.URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(customer_data)
    });

    const result = await response.json();

    // Handle response - EXACT same logic as PHP lines 499-541
    if (!response.ok) {
      return NextResponse.json({
        status: "Fail",
        message: "PayGlocal API call failed",
        error: result
      }, { status: 500 });
    }

    if (result.gid) {
      // Success - return payment URL for redirect
      return NextResponse.json({
        status: "Success",
        gid: result.gid,
        redirectURL: result.redirectURL || result.paymentUrl,
        message: "PayGlocal payment initiated successfully"
      });
    } else {
      return NextResponse.json({
        status: "Fail", 
        message: "PayGlocal initiation failed",
        error: result
      }, { status: 400 });
    }

  } catch (error) {
    console.error('PayGlocal initiation error:', error);
    return NextResponse.json(
      { 
        status: "Fail",
        error: 'Payment initiation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
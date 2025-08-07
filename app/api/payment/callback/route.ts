import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmailOrderConfirm } from '@/lib/email/order-confirmation';
import { updateTransactionStatus, updatePaymentStatus, updateEmailMobileInQualifiers, updateZohoDealInfo } from '@/lib/database/payment-operations';
import { zohoClient } from '@/lib/integrations/eizoho';
import { recordPaymentFailure } from '@/lib/database/failure-operations';
import { sendResponseToGoogleSheet } from '@/lib/integrations/google-sheets';
import { trackPaymentSuccess, trackPaymentFailure } from '@/lib/analytics/payment-tracking';
import { verifychecksum } from '@/lib/utils/libfuncs';

// Payment status mapping (EXACT same as PHP)
const STATUS_ARRAY: { [key: string]: string } = {
  '0300': 'Success',
  '0399': 'Rejected', 
  'NA': 'Rejected',
  '0002': 'Pending',
  '0001': 'Rejected'
};

// CHECKSUM_KEY (same as PHP line 13)
const CHECKSUM_KEY = "XfpsuCwstgti";

export async function POST(request: NextRequest) {
  try {
    // Extract all form data (equivalent to PHP $_REQUEST processing, lines 15-19)
    const formData = await request.formData();
    const requestData: { [key: string]: string } = {};
    
    for (const [key, value] of formData.entries()) {
      requestData[key] = value.toString();
    }
    
    // Extract AuthDesc parameter (used in PHP line 118)
    const AuthDesc = requestData.AuthDesc || '';

    // Get the 'msg' parameter (equivalent to PHP line 82)
    const msg = requestData.msg || '';
    
    // Payment gateway response email for checking issues (equivalent to PHP line 84)
    // @mail("einotification.sudhir@gmail.com","ATS payment response",msg);
    
    // Parse message components (equivalent to PHP lines 85-100)
    const msgComponents = msg.split('|');
    const checkSumPost = msgComponents.pop() || '';
    
    const returnOrderID = msgComponents[1] || '';
    const transactionID = msgComponents[2] || '';
    const amount = Math.round(parseFloat(msgComponents[4]) || 0);
    const statusCode = msgComponents[14] || '';
    const status = STATUS_ARRAY[statusCode] || 'Rejected';
    const transactionReason = msgComponents[24] || '';
    const authDesc = msgComponents[23] || statusCode; // AuthDesc from response
    
    // CRITICAL: Use proper libfuncs checksum verification - EXACT same as PHP
    const merchantId = msgComponents[0] || '';
    const orderId = msgComponents[1] || '';
    const amountStr = msgComponents[4] || '';
    
    const isChecksumValid = verifychecksum(
      merchantId,
      orderId, 
      amountStr,
      authDesc,
      checkSumPost,
      CHECKSUM_KEY
    );
    
    // Determine payment status (equivalent to PHP lines 91-96)
    const paymentStatus = (statusCode === "0300" && isChecksumValid) ? "Y" : "N";
    
    // Update transaction status (equivalent to PHP line 101)
    const transactionStatusUpdate = await updateTransactionStatus(
      status, 
      transactionID, 
      returnOrderID, 
      transactionReason, 
      msg, 
      amount
    );
    
    // Extract order site (equivalent to PHP line 102)
    const orderSite = returnOrderID.substring(0, 3);
    
    if (paymentStatus === 'Y' && status === 'Success' && transactionStatusUpdate) {
      // SUCCESS PROCESSING (equivalent to PHP lines 104-129)
      
      const orderType = returnOrderID.substring(0, 5);
      
      if (orderType === "ATSNA") {
        // NonASSET registration (equivalent to PHP lines 110-112)
        await updatePaymentStatus('ats_nonasset_regDetails', returnOrderID, 'nonasset');
      } else {
        // Regular ASSET registration (equivalent to PHP lines 115-122)
        await updatePaymentStatus('duketip_registrationDetails', returnOrderID, 'asset', AuthDesc);
        
        // Send confirmation email (equivalent to PHP line 123)
        await sendEmailOrderConfirm(returnOrderID, orderSite);
        
        // Update qualifiers (equivalent to PHP line 124)
        await updateEmailMobileInQualifiers(returnOrderID);
        
        // Update CRM if live server (equivalent to PHP lines 126-128)
        if (process.env.SERVER_TYPE === "Live") {
          await updateZohoDealInfo(returnOrderID);
        }
      }
      
      // Track analytics (payment success)
      await trackPaymentSuccess(returnOrderID, amount);
      
      // Return success page HTML (equivalent to PHP success display)
      return new NextResponse(generateSuccessPageHTML(returnOrderID, transactionID, orderSite), {
        headers: { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, must-revalidate' // Missing from PHP line 4
        },
      });
      
    } else {
      // FAILURE PROCESSING (equivalent to PHP lines 223-281)
      
      // Record payment failure (equivalent to PHP line 225)
      await recordPaymentFailure(returnOrderID, transactionReason, transactionID);
      
      // Determine user-friendly error message (equivalent to PHP lines 227-228)
      const cancelReason = transactionReason?.trim() === "Canceled By User" 
        ? "you have cancelled your payment."
        : "your payment is declined.";
      
      // Track analytics (payment failure)
      await trackPaymentFailure();
      
      // Return failure page HTML (equivalent to PHP failure display)
      return new NextResponse(generateFailurePageHTML(cancelReason, orderSite), {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

// GET handler for direct access (some payment gateways use GET)
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const msg = url.searchParams.get('msg') || '';
  
  // Convert to form data format and process
  const formData = new FormData();
  for (const [key, value] of url.searchParams.entries()) {
    formData.append(key, value);
  }
  
  // Create a new request with form data
  const newRequest = new NextRequest(request.url, {
    method: 'POST',
    body: formData,
  });
  
  return POST(newRequest);
}

// Generate success page HTML (equivalent to PHP lines 164-220)
function generateSuccessPageHTML(orderID: string, transactionID: string, orderSite: string): string {
  const duketipemail = "eitalentsearch@ei.study";
  const giftedemail = "gts@giftedindia.org";
  const contactEmail = orderSite === "GTS" ? giftedemail : duketipemail;
  const regPage = orderSite === "GTS" ? "gifted_talent_search_registration.php" : "ats_registration.php";
  const siteUrl = process.env.ATS_SITE_URL || "https://ei.study/";
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>EI - ASSET Talent Search Registration</title>
    <link rel="stylesheet" href="bootstrap/css/bootstrap.css" type="text/css" />
    <link rel="stylesheet" href="css/reset.css" type="text/css" />
    <link rel="stylesheet" href="css/style_old.css" type="text/css" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    
    <!-- GTM code -->
    <script>
        dataLayer = [];
        window.dataLayer = window.dataLayer || [];
    </script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-NG482KJ');
    </script>
    
    <!-- Facebook Pixel Code -->
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '766151107175176');
        fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=766151107175176&ev=PageView&noscript=1"/></noscript>
    
    <!-- Google Ads -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-702627741"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-702627741');
    </script>
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NG482KJ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    
    <div class="container-fluid">
        ${orderSite === "GTS" ? 
          `<!-- Genwise header would go here -->` : 
          `<!-- header -->
          <header>
              <div class="row">
                  <div class="col-xs-1"></div>
                  <div class="col-xs-10 pad0">
                      <div class="row">
                          <div class="col-xs-3 pad0">
                              <a href="${siteUrl}">
                                  <img src="assets/img/ats_logo_2025.png" class="img-responsive" />
                              </a>
                          </div>
                          <div class="col-xs-6"></div>
                          <div class="clearfix"></div>
                      </div>
                  </div>
                  <div class="col-md-1"></div>
              </div>
          </header>
          <!-- header end -->`
        }
        
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
                If you don't receive a confirmation email within 7 days, please email us at <a href="mailto:${contactEmail}">${contactEmail}</a>
            </div>
            <div><a href="${siteUrl}${regPage}" target="_self">Return To Registration Page</a></div>
        </div>
    </div>
    
    <div style="height:70px;">&nbsp;</div>
    ${orderSite !== "GTS" ? `<!-- Footer would go here -->` : ''}
</body>
</html>`;
}

// Generate failure page HTML (equivalent to PHP lines 241-279)
function generateFailurePageHTML(cancelReason: string, orderSite: string): string {
  const duketipemail = "eitalentsearch@ei.study";
  const siteUrl = process.env.ATS_SITE_URL || "https://ei.study/";
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>EI - ASSET Talent Search Registration</title>
    <link rel="stylesheet" href="bootstrap/css/bootstrap.css" type="text/css" />
    <link rel="stylesheet" href="css/reset.css" type="text/css" />
    <link rel="stylesheet" href="css/style_old.css" type="text/css" />
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
                            <a href="${siteUrl}">
                                <img src="assets/img/ats_logo_2025.png" class="img-responsive" />
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
        
        <div class="row text-center black-small">
            <div class="col-xs-12">
                We regret to inform you that ${cancelReason}<br>
                We request you to try again in some time. If the problem continues, please contact our customer support at <a href="mailto:${duketipemail}">${duketipemail}</a>
            </div>
            <div><a href="${siteUrl}index.php" target="_self">Return To Home Page</a></div>
        </div>
    </div>
    
    <div style="height:70px;">&nbsp;</div>
    <!-- Footer would go here -->
</body>
</html>`;
}
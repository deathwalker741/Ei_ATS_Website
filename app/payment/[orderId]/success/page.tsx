'use client'

import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Payment Success Page
 * Equivalent to PHP success display (lines 164-220 in asset_talent_search_order_save.php)
 */
export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const transactionId = searchParams.get('transactionId') || '';
  const orderSite = searchParams.get('site') || 'ATS';

  const duketipemail = "eitalentsearch@ei.study";
  const giftedemail = "gts@giftedindia.org";
  const contactEmail = orderSite === "GTS" ? giftedemail : duketipemail;
  const regPage = orderSite === "GTS" ? "gifted_talent_search_registration.php" : "ats_registration.php";
  const siteUrl = process.env.NEXT_PUBLIC_ATS_SITE_URL || "https://ei.study/";

  useEffect(() => {
    // Track analytics (equivalent to PHP sendPaymentConfirmationToAnalytics)
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        'ga_event_category': 'Payment',
        'ga_event_action': 'success',
        'ga_event_label': 'ATS-billdesk',
        'event': 'success_payment_billdesk'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* GTM noscript */}
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-NG482KJ"
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      <div className="container-fluid">
        {orderSite === "GTS" ? (
          <div>
            {/* Genwise header would go here */}
          </div>
        ) : (
          // Header (equivalent to PHP header section)
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <a href={siteUrl}>
                    <img 
                      src="/assets/img/ats_logo_2025.png" 
                      alt="ATS Logo" 
                      className="h-12 w-auto"
                    />
                  </a>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main content */}
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              {/* Success message (equivalent to PHP lines 201-202) */}
              <div className="text-center mb-8">
                <div className="mb-4">
                  <svg 
                    className="mx-auto h-16 w-16 text-green-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-orange-600 mb-4">
                  Congratulations! Your child's wonderful journey of self-discovery has now begun.
                </h1>
              </div>

              {/* Registration details */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="text-center text-gray-800">
                  <p className="text-lg mb-4">
                    Registration was successful. You will shortly receive a confirmation email from us.
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      If you don't receive a confirmation email within 7 days, please email us at{' '}
                      <a 
                        href={`mailto:${contactEmail}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {contactEmail}
                      </a>
                    </p>
                    
                    {orderId && (
                      <p>
                        <strong>Order ID:</strong> {orderId}
                      </p>
                    )}
                    
                    {transactionId && (
                      <p>
                        <strong>Transaction ID:</strong> {transactionId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="text-center">
                <a 
                  href={`${siteUrl}${regPage}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return To Registration Page
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: '70px' }}>&nbsp;</div>

        {/* Footer */}
        {orderSite !== "GTS" && (
          <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p>&copy; 2025 Educational Initiatives. All rights reserved.</p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
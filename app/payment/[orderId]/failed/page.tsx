'use client'

import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Payment Failed Page
 * Equivalent to PHP failure display (lines 241-279 in asset_talent_search_order_save.php)
 */
export default function PaymentFailedPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const reason = searchParams.get('reason') || 'your payment is declined.';
  const orderSite = searchParams.get('site') || 'ATS';

  const duketipemail = "eitalentsearch@ei.study";
  const siteUrl = process.env.NEXT_PUBLIC_ATS_SITE_URL || "https://ei.study/";

  useEffect(() => {
    // Track analytics (equivalent to PHP sendPaymentFailToAnalytics)
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        'ga_event_category': 'ATSPayment',
        'ga_event_action': 'fail',
        'ga_event_label': 'ATS-billdesk',
        'ga_event_value': '0',
        'event': 'fail_payment_billdesk'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-fluid">
        {/* Header (equivalent to PHP header section lines 243-261) */}
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

        {/* Main content */}
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              {/* Error message */}
              <div className="text-center mb-8">
                <div className="mb-4">
                  <svg 
                    className="mx-auto h-16 w-16 text-red-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.19 2.5 1.732 2.5z" 
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-4">
                  Payment Failed
                </h1>
              </div>

              {/* Failure details */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="text-center text-gray-800">
                  {/* Equivalent to PHP lines 274-275 */}
                  <p className="text-lg mb-4">
                    We regret to inform you that {reason}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      We request you to try again in some time. If the problem continues, please contact our customer support at{' '}
                      <a 
                        href={`mailto:${duketipemail}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {duketipemail}
                      </a>
                    </p>
                    
                    {orderId && (
                      <p>
                        <strong>Order ID:</strong> {orderId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="text-center space-y-4">
                {/* Equivalent to PHP line 277 */}
                <div>
                  <a 
                    href={`${siteUrl}index.php`}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Return To Home Page
                  </a>
                </div>

                {/* Try again button */}
                <div>
                  <a 
                    href="/ats-registration"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Registration Again
                  </a>
                </div>
              </div>

              {/* Additional help */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-500">
                  <p>Common reasons for payment failure:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Insufficient funds in your account</li>
                    <li>• Network connectivity issues</li>
                    <li>• Incorrect card details</li>
                    <li>• Transaction cancelled by user</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: '70px' }}>&nbsp;</div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>&copy; 2025 Educational Initiatives. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
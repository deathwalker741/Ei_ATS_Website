// Analytics tracking for payments - EXACT same as PHP functions
// Equivalent to PHP sendPaymentConfirmationToAnalytics and sendPaymentFailToAnalytics

/**
 * Track successful payment
 * Equivalent to PHP function sendPaymentConfirmationToAnalytics (lines 451-470)
 */
export async function trackPaymentSuccess(orderID: string, amount: number): Promise<void> {
  // This would typically be handled client-side with GTM
  // For server-side tracking, we can use Google Analytics Measurement Protocol
  
  try {
    // Google Analytics 4 Measurement Protocol (if needed server-side)
    const measurementId = process.env.GA4_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_API_SECRET;
    
    if (measurementId && apiSecret) {
      const payload = {
        client_id: orderID, // Use orderID as client identifier
        events: [{
          name: 'success_payment_billdesk',
          parameters: {
            event_category: 'Payment',
            event_action: 'success',
            event_label: 'ATS-billdesk',
            value: amount,
            currency: 'INR',
            transaction_id: orderID
          }
        }]
      };
      
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }
    
    // Log for debugging
    console.log('Payment success tracked:', { orderID, amount });
    
  } catch (error) {
    console.error('Error tracking payment success:', error);
  }
}

/**
 * Track failed payment
 * Equivalent to PHP function sendPaymentFailToAnalytics (lines 471-488)
 */
export async function trackPaymentFailure(): Promise<void> {
  try {
    // Google Analytics 4 Measurement Protocol (if needed server-side)
    const measurementId = process.env.GA4_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_API_SECRET;
    
    if (measurementId && apiSecret) {
      const payload = {
        client_id: 'anonymous_' + Date.now(), // Anonymous client for failures
        events: [{
          name: 'fail_payment_billdesk',
          parameters: {
            event_category: 'ATSPayment',
            event_action: 'fail',
            event_label: 'ATS-billdesk',
            value: 0
          }
        }]
      };
      
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }
    
    // Log for debugging
    console.log('Payment failure tracked');
    
  } catch (error) {
    console.error('Error tracking payment failure:', error);
  }
}
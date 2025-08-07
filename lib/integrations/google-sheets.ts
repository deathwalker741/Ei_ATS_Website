// Google Sheets integration - EXACT same as PHP sendResponseToGoogleSheet
// Equivalent to PHP lines 443-450

/**
 * Send payment failure data to Google Sheets
 * Equivalent to PHP function sendResponseToGoogleSheet
 */
export async function sendResponseToGoogleSheet(data: {
  orderId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  parentEmail: string;
  parentStdCode: string;
  parentCell: string;
  class: number;
  examdate: string;
  panNumber: string;
  schoolname: string;
  transactionId: string;
  transactionDetails: string;
  amount: number;
  EnteredDate: string;
}): Promise<void> {
  try {
    // Exact same Google Apps Script URL as PHP (line 446)
    const url = "https://script.google.com/macros/s/AKfycbzTjpqYb7UEpbp-OFXEoAUfd4UAlje0NkQ4CjbeHyD-JCFvROEspShQrR0qHPuAtefISg/exec";
    
    // Build query string (equivalent to PHP line 447)
    const urlencoded = new URLSearchParams(data as any).toString();
    
    // Send data (equivalent to PHP line 448)
    const response = await fetch(`${url}?${urlencoded}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'ATS-NextJS/1.0',
      },
    });
    
    if (!response.ok) {
      console.error('Google Sheets API error:', response.statusText);
    }
    
  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
  }
}
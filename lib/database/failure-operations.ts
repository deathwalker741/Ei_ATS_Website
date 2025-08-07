// Payment failure operations - EXACT same logic as PHP
import { db } from '@/lib/database';
import { sendResponseToGoogleSheet } from '@/lib/integrations/google-sheets';

/**
 * Record payment failure
 * Equivalent to PHP function recordPaymentFailure (lines 400-442)
 */
export async function recordPaymentFailure(
  orderID: string,
  transactionDetails: string,
  transactionID: string
): Promise<void> {
  try {
    // Get registration data (equivalent to PHP lines 402-411)
    const query = `
      SELECT 
        dr.firstName, dr.lastName, dr.middleName,
        dr.parentEmail, dr.parentStdCode, dr.parentCell, dr.class,
        atc.test_center, DATE_FORMAT(dr.venue_date,'%d-%m-%Y') as examdate,
        dr.panNumber, atvs.venue_slot, atvs.venue_date,
        dt.amount, 
        IF(dr.schoolCode != 0, s.schoolname, dr.schoolname) as schoolname
      FROM duketip_registrationDetails dr
      LEFT JOIN schools s ON dr.schoolCode = s.schoolno
      LEFT JOIN ats_test_centers atc ON dr.examCity1 = atc.id
      LEFT JOIN ats_test_centers_venues_slots atvs ON dr.venue_slot_id = atvs.id
      LEFT JOIN duketip_transactionDetails dt ON dr.orderID = dt.orderID
      WHERE dr.orderID = ?
    `;
    
    const result = await db.execute(query, [orderID]);
    
    if (result.rows.length > 0) {
      const registrationData = result.rows[0];
      
      // Prepare data for Google Sheets (equivalent to PHP lines 419-435)
      const data = {
        orderId: orderID,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        middleName: registrationData.middleName,
        parentEmail: registrationData.parentEmail,
        parentStdCode: '+91', // Default as per PHP
        parentCell: registrationData.parentCell,
        class: registrationData.class,
        examdate: registrationData.examdate,
        panNumber: registrationData.panNumber,
        schoolname: registrationData.schoolname,
        transactionId: transactionID,
        transactionDetails: transactionDetails,
        amount: registrationData.amount,
        EnteredDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      };
      
      // Send to Google Sheets (equivalent to PHP line 437)
      await sendResponseToGoogleSheet(data);
    }
    
  } catch (error) {
    console.error('Error recording payment failure:', error);
  }
}
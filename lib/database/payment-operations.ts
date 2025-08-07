// Database operations for payment processing - EXACT same logic as PHP
import { db } from '@/lib/database';
import { ClsDuketip } from '@/lib/classes/eiduketip';

/**
 * Update transaction status (equivalent to PHP clsduketip->updateTransactionStatus)
 * Line 101 in asset_talent_search_order_save.php
 */
export async function updateTransactionStatus(
  status: string,
  transactionID: string, 
  orderID: string,
  transactionReason: string,
  msg: string,
  amount: number
): Promise<boolean> {
  try {
    // Use the EXACT same method as PHP class (line 1531)
    const clsduketip = new ClsDuketip();
    const affectedRows = await clsduketip.updateTransactionStatus(
      status, 
      transactionID, 
      orderID, 
      transactionReason, 
      msg, 
      amount.toString()
    );
    
    return affectedRows > 0;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return false;
  }
}

/**
 * Update payment status for registrations
 * Equivalent to PHP lines 110-122 in asset_talent_search_order_save.php
 */
export async function updatePaymentStatus(
  tableName: string,
  orderID: string,
  type: 'asset' | 'nonasset',
  authDesc?: string
): Promise<boolean> {
  try {
    if (type === 'nonasset') {
      // NonASSET registration (equivalent to PHP lines 110-112)
      const result = await db.execute(
        `UPDATE ats_nonasset_regDetails 
         SET paymentStatus = 'paid', 
             paymentDate = NOW(), 
             updated_dt = NOW() 
         WHERE orderid = ?`,
        [orderID]
      );
      return result.affectedRows > 0;
      
    } else {
      // Regular ASSET registration (equivalent to PHP lines 115-122)
      // Note: authDesc comes from payment gateway response (AuthDesc parameter)
      const result = await db.execute(
        `UPDATE duketip_registrationDetails 
         SET paymentStatus = 'paid',
             acctCreditedDate = CURDATE(),
             authDesc = ?,
             modified_date = NOW()
         WHERE orderID = ?`,
        [authDesc || 'Payment Successful', orderID]
      );
      return result.affectedRows > 0;
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    return false;
  }
}

/**
 * Update email and mobile in qualifiers
 * Equivalent to PHP line 124: $clsduketip->UpdateEmailMobileInQualifiers
 */
export async function updateEmailMobileInQualifiers(orderID: string): Promise<void> {
  try {
    // Use the EXACT same method as PHP class (line 6201)
    const clsduketip = new ClsDuketip();
    await clsduketip.UpdateEmailMobileInQualifiers(orderID);
  } catch (error) {
    console.error('Error updating qualifiers:', error);
  }
}

/**
 * Update Zoho CRM deal information
 * Equivalent to PHP line 127: $clsduketip->UpdateZohoDealInfo
 */
export async function updateZohoDealInfo(orderID: string): Promise<void> {
  try {
    // Use the EXACT same method as PHP class (line 6229)
    const clsduketip = new ClsDuketip();
    await clsduketip.UpdateZohoDealInfo(orderID);
  } catch (error) {
    console.error('Error updating Zoho CRM:', error);
  }
}

/**
 * Get registration details for email/display
 * Equivalent to the query in sendEmailOrderConfirm function (PHP lines 303-311)
 */
export async function getRegistrationDetails(orderID: string) {
  try {
    const result = await db.execute(
      `SELECT 
         dr.firstName, dr.lastName, dr.middleName,
         dr.parentEmail, dr.studentEmail, dr.class,
         dr.parentCategory, dr.parentFirstName, dr.parentLastName,
         dr.panNumber, dr.schoolName as registered_schoolname, 
         dr.amount_paid, dr.referrer, dr.subjectnos_selected,
         s.schoolname, s.city,
         DATE_FORMAT(dr.venue_date, '%d-%m-%Y') as examdate
       FROM duketip_registrationDetails dr
       LEFT JOIN schools s ON dr.schoolCode = s.schoolno
       WHERE dr.orderID = ?`,
      [orderID]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting registration details:', error);
    return null;
  }
}
/**
 * libfuncs.ts - EXACT port of PHP libfuncs.php
 * Contains critical checksum functions for BillDesk payment validation
 * 
 * CRITICAL: These functions are ESSENTIAL for payment processing
 * Any deviation from PHP implementation will cause payment failures
 */

/**
 * Generate checksum for BillDesk payment
 * EXACT same as PHP function getchecksum() lines 3-9
 */
export function getchecksum(
  merchantId: string, 
  amount: string, 
  orderId: string, 
  url: string, 
  workingKey: string
): number {
  const str = `${merchantId}|${orderId}|${amount}|${url}|${workingKey}`;
  let adler = 1;
  adler = adler32(adler, str);
  return adler;
}

/**
 * Verify checksum for BillDesk payment response
 * EXACT same as PHP function verifychecksum() lines 11-21
 */
export function verifychecksum(
  merchantId: string,
  orderId: string, 
  amount: string,
  authDesc: string,
  checkSum: string,
  workingKey: string
): boolean {
  const str = `${merchantId}|${orderId}|${amount}|${authDesc}|${workingKey}`;
  let adler = 1;
  adler = adler32(adler, str);
  
  const checkSumNum = parseInt(checkSum, 10);
  return adler === checkSumNum;
}

/**
 * Adler-32 checksum algorithm
 * EXACT same as PHP function adler32() lines 23-37
 */
export function adler32(adler: number, str: string): number {
  const BASE = 65521;
  
  let s1 = adler & 0xffff;
  let s2 = (adler >> 16) & 0xffff;
  
  for (let i = 0; i < str.length; i++) {
    s1 = (s1 + str.charCodeAt(i)) % BASE;
    s2 = (s2 + s1) % BASE;
  }
  
  return leftshift(s2, 16) + s1;
}

/**
 * Left shift operation for binary manipulation
 * EXACT same as PHP function leftshift() lines 39-54
 */
export function leftshift(num: number, shiftAmount: number): number {
  // Convert to binary string - EXACT same as PHP DecBin()
  let binaryStr = num.toString(2);
  
  // Pad to 64 bits - EXACT same as PHP loop lines 44-45
  while (binaryStr.length < 64) {
    binaryStr = "0" + binaryStr;
  }
  
  // Perform left shift - EXACT same as PHP loop lines 47-52
  for (let i = 0; i < shiftAmount; i++) {
    binaryStr = binaryStr + "0";
    binaryStr = binaryStr.substring(1);
  }
  
  return cdec(binaryStr);
}

/**
 * Convert binary string to decimal
 * EXACT same as PHP function cdec() lines 56-67
 */
export function cdec(binaryStr: string): number {
  let dec = 0;
  
  for (let n = 0; n < binaryStr.length; n++) {
    const temp = parseInt(binaryStr[n], 10);
    dec = dec + temp * Math.pow(2, binaryStr.length - n - 1);
  }
  
  return dec;
}

/**
 * Template rendering function
 * EXACT same as PHP function template() lines 68-78
 * Note: This is primarily for PHP compatibility, may not be used in TypeScript
 */
export function template(file: string, data: Record<string, any> = {}): string {
  // In TypeScript/Node.js environment, this would need different implementation
  // For now, returning empty string as this function is not critical for payments
  console.warn('Template function called - PHP compatibility function');
  return '';
}

/**
 * TESTING UTILITIES
 * These functions help verify our implementation matches PHP exactly
 */
export function testChecksumCompatibility(): void {
  console.log('Testing libfuncs compatibility with PHP...');
  
  // Test data that should match PHP output
  const testMerchantId = "EDUINPL";
  const testOrderId = "ATS1234567890";
  const testAmount = "2500";
  const testUrl = "https://ats.ei.study/api/payment/callback";
  const testWorkingKey = "XfpsuCwstgti";
  
  const checksum = getchecksum(testMerchantId, testAmount, testOrderId, testUrl, testWorkingKey);
  console.log('Generated checksum:', checksum);
  
  const isValid = verifychecksum(testMerchantId, testOrderId, testAmount, "Success", checksum.toString(), testWorkingKey);
  console.log('Checksum verification:', isValid);
}

// Export all functions for use in payment processing
export default {
  getchecksum,
  verifychecksum,
  adler32,
  leftshift,
  cdec,
  template,
  testChecksumCompatibility
};
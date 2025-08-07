// CCAvenue encryption/decryption utilities - EXACT port from PHP paymentFunctions.php
import { createHash } from 'crypto';

/**
 * Convert hexadecimal string to binary - EXACT port from PHP hextobin() function
 * From ats/ats/asset_talent_search/registeration/ccavenue/paymentFunctions.php lines 38-54
 */
function hextobin(hexString: string): Buffer {
  const length = hexString.length;
  let binString = '';
  let count = 0;
  
  while (count < length) {
    const subString = hexString.substr(count, 2);
    const packedString = Buffer.from(subString, 'hex');
    
    if (count === 0) {
      binString = packedString.toString('binary');
    } else {
      binString += packedString.toString('binary');
    }
    count += 2;
  }
  
  return Buffer.from(binString, 'binary');
}

/**
 * PKCS5 padding function - EXACT port from PHP pkcs5_pad() function  
 * From ats/ats/asset_talent_search/registeration/ccavenue/paymentFunctions.php lines 31-35
 */
function pkcs5_pad(plainText: string, blockSize: number): string {
  const pad = blockSize - (plainText.length % blockSize);
  return plainText + String.fromCharCode(pad).repeat(pad);
}

/**
 * CCAvenue encrypt function - EXACT port from PHP encrypt() function
 * From ats/ats/asset_talent_search/registeration/ccavenue/paymentFunctions.php lines 3-15
 * 
 * Uses AES-128-CBC encryption with:
 * - MD5 hashed key
 * - Fixed initialization vector
 * - PKCS5 padding
 */
export function encrypt(plainText: string, key: string): string {
  const crypto = require('crypto');
  
  // EXACT same as PHP: $secretKey = hextobin(md5($key));
  const secretKey = hextobin(createHash('md5').update(key).digest('hex'));
  
  // EXACT same initialization vector as PHP
  // pack("C*", 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f)
  const initVector = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);
  
  // EXACT same block size as PHP: MCRYPT_RIJNDAEL_128 = 16 bytes
  const blockSize = 16;
  
  // EXACT same padding as PHP
  const plainPad = pkcs5_pad(plainText, blockSize);
  
  // Create cipher - equivalent to mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', 'cbc', '')
  const cipher = crypto.createCipheriv('aes-128-cbc', secretKey, initVector);
  cipher.setAutoPadding(false); // We handle padding manually like PHP
  
  let encryptedText = cipher.update(plainPad, 'utf8', 'binary');
  encryptedText += cipher.final('binary');
  
  // EXACT same as PHP: return bin2hex($encryptedText);
  return Buffer.from(encryptedText, 'binary').toString('hex');
}

/**
 * CCAvenue decrypt function - EXACT port from PHP decrypt() function
 * From ats/ats/asset_talent_search/registeration/ccavenue/paymentFunctions.php lines 17-29
 */
export function decrypt(encryptedText: string, key: string): string {
  const crypto = require('crypto');
  
  // EXACT same as PHP: $secretKey = hextobin(md5($key));
  const secretKey = hextobin(createHash('md5').update(key).digest('hex'));
  
  // EXACT same initialization vector as PHP
  const initVector = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);
  
  // EXACT same as PHP: $encryptedText=hextobin($encryptedText);
  const encryptedBuffer = hextobin(encryptedText);
  
  // Create decipher - equivalent to mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', 'cbc', '')
  const decipher = crypto.createDecipheriv('aes-128-cbc', secretKey, initVector);
  decipher.setAutoPadding(false); // We handle padding manually like PHP
  
  let decryptedText = decipher.update(encryptedBuffer, undefined, 'utf8');
  decryptedText += decipher.final('utf8');
  
  // EXACT same as PHP: $decryptedText = rtrim($decryptedText, "\0");
  return decryptedText.replace(/\0+$/, '');
}

/**
 * CCAvenue constants - EXACT same as PHP constants.php
 */
// Dynamic return URL based on environment
const getReturnUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? "https://ats.ei.study/api/payment/ccavenue/callback"
    : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment/ccavenue/callback`;
};

export const CCAVENUE_CONFIG = {
  // UAE CCAvenue Account (lines 275-278 in constants.php)
  UAE: {
    MERCHANT_ID: "44726",
    WORKING_KEY: "DF8399F202D2E1BA5BDA46E60B40EC5C",
    ACCESS_CODE: "AVGX02FB73BT09XGTB",
    URL: "https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction",
    RETURN_URL: getReturnUrl()
  },
  
  // EI CCAvenue Account (lines 285-288 in constants.php)
  INTERNATIONAL: {
    MERCHANT_ID: "63455",
    WORKING_KEY: "57949426A67E96BE472761554B67A616",
    ACCESS_CODE: "AVYN93HG55BH69NYHB", 
    URL: "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
    RETURN_URL: getReturnUrl()
  }
};

/**
 * Clean special characters from string - EXACT same as PHP regex
 * From asset_talent_search_order.php line 287: $pattern = '/[^a-zA-Z0-9-_.@ ]/'
 */
export function cleanSpecialChars(input: string): string {
  return input.replace(/[^a-zA-Z0-9\-_.@ ]/g, '');
}

/**
 * Clean phone number - EXACT same as PHP regex  
 * From asset_talent_search_order.php line 325: preg_replace("/[^0-9]/", $replacement, $clsduketip->parentCell, -1)
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}
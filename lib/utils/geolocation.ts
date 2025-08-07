/**
 * geolocation.ts - EXACT port of PHP commonFunctions.php
 * Geolocation utilities for ATS registration system
 * 
 * CRITICAL: This handles IP-based country detection for payment routing
 * Any deviation from PHP implementation will cause incorrect country detection
 */

// NOTE: This file is SERVER-SIDE ONLY. Do **NOT** import it inside a Client Component.
// If you need geolocation in the browser, call the ip-api endpoint directly
// (it infers IP from the request) instead of using next/headers.

export interface LocationData {
  countryCode?: string;
  countryName?: string;
  city?: string;
}

export interface GeolocationApiResponse {
  country?: string;
  countryCode?: string;
  city?: string;
  status?: string;
  message?: string;
}

// Constants - EXACT same as PHP constants.php lines 409-410
const GEO_LOCATION_KEY = "fU7Wvn6ZzVHNjXS";
const DEFAULT_ATS_COUNTRY = "india";

/**
 * Get location info by IP address
 * EXACT same as PHP function getLocationInfoByIp() lines 14-56
 */
export async function getLocationInfoByIp(customIP?: string): Promise<LocationData> {
  try {
    let ip: string;
    
    if (customIP) {
      // For testing purposes - equivalent to PHP dummy IP lines 16-22
      ip = customIP;
    } else {
      // Get IP from request headers - EXACT same as PHP lines 24-47
      const headersList = headers();
      const client = headersList.get('x-client-ip') || headersList.get('cf-connecting-ip');
      const forward = headersList.get('x-forwarded-for');
      const remote = headersList.get('x-real-ip') || headersList.get('remote-addr');
      
      // Handle comma-separated IPs - EXACT same as PHP lines 28-38
      let clientIP = client;
      let forwardIP = forward;
      let remoteIP = remote;
      
      if (clientIP && clientIP.includes(',')) {
        clientIP = clientIP.split(',')[0].trim();
      }
      if (forwardIP && forwardIP.includes(',')) {
        forwardIP = forwardIP.split(',')[0].trim();
      }
      if (remoteIP && remoteIP.includes(',')) {
        remoteIP = remoteIP.split(',')[0].trim();
      }
      
      // Validate and select IP - EXACT same as PHP lines 41-47
      if (clientIP && isValidIP(clientIP)) {
        ip = clientIP;
      } else if (forwardIP && isValidIP(forwardIP)) {
        ip = forwardIP;
      } else if (remoteIP && isValidIP(remoteIP)) {
        ip = remoteIP;
      } else {
        // Fallback to a default IP for development
        ip = '8.8.8.8'; // Google DNS as fallback
      }
    }
    
    // Call geolocation API - EXACT same as PHP line 49
    const apiUrl = `https://pro.ip-api.com/json/${ip}?key=${GEO_LOCATION_KEY}`;
    const response = await fetch(apiUrl);
    const ipData: GeolocationApiResponse = await response.json();
    
    const result: LocationData = {};
    
    // Parse response - EXACT same as PHP lines 50-54
    if (ipData && ipData.country) {
      result.countryCode = ipData.countryCode;
      result.countryName = ipData.country;
      result.city = ipData.city;
    }
    
    return result;
    
  } catch (error) {
    console.error('Geolocation error:', error);
    // Return empty object on error - same as PHP behavior
    return {};
  }
}

/**
 * Validate IP address
 * Equivalent to PHP filter_var($ip, FILTER_VALIDATE_IP)
 */
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Get locale country for ATS
 * EXACT same as PHP lines 58-65
 */
export async function getATSLocaleCountry(customIP?: string): Promise<string> {
  const arrLocation = await getLocationInfoByIp(customIP);
  
  if (arrLocation.countryName) {
    const countryName = arrLocation.countryName.toLowerCase();
    return countryName === DEFAULT_ATS_COUNTRY ? DEFAULT_ATS_COUNTRY : "international";
  } else {
    return DEFAULT_ATS_COUNTRY;
  }
}

/**
 * Get country for payment routing
 * This function determines which payment gateway to use based on location
 */
export async function getCountryForPayment(customIP?: string): Promise<string> {
  const arrLocation = await getLocationInfoByIp(customIP);
  
  if (arrLocation.countryName) {
    const country = arrLocation.countryName;
    
    // Map to exact country names used in payment routing
    switch (country.toLowerCase()) {
      case 'india':
        return 'India';
      case 'united arab emirates':
        return 'United Arab Emirates';
      default:
        return country; // Return as-is for international
    }
  }
  
  // Default to India if geolocation fails
  return 'India';
}

/**
 * TESTING UTILITIES
 * These functions help test geolocation with specific IPs
 */
export async function testGeolocationWithIPs(): Promise<void> {
  console.log('Testing geolocation with different IPs...');
  
  // Test with India IP
  const indiaResult = await getLocationInfoByIp('14.96.0.0');
  console.log('India IP result:', indiaResult);
  
  // Test with UAE IP
  const uaeResult = await getLocationInfoByIp('119.160.236.0');
  console.log('UAE IP result:', uaeResult);
  
  // Test with International IP
  const intlResult = await getLocationInfoByIp('103.216.0.0');
  console.log('International IP result:', intlResult);
}

// Export all functions
export default {
  getLocationInfoByIp,
  getATSLocaleCountry,
  getCountryForPayment,
  testGeolocationWithIPs
};
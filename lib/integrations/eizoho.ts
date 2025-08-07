/**
 * eizoho.ts - EXACT port of PHP eizoho.cls.php
 * Complete Zoho CRM integration for ATS registration system
 * 
 * CRITICAL: This class handles all Zoho CRM operations including:
 * - Contact creation and updates
 * - Deal creation and updates  
 * - Invoice creation
 * - Payment status updates
 * - Data search and retrieval
 */

export interface ZohoTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface ZohoContactData {
  Email?: string;
  First_Name?: string;
  Last_Name?: string;
  Phone?: string;
  Account_Name?: string;
  Pan_Number?: string;
  Full_Name?: string;
  [key: string]: any;
}

export interface ZohoDealData {
  Deal_Name?: string;
  Contact_Name?: string;
  Amount?: number;
  Stage?: string;
  Product1?: string;
  Academic_Year?: string;
  Program_Details_ID?: string;
  ASSET_Qualifying_Year?: string;
  Pan_Number?: string;
  [key: string]: any;
}

export class ClsZoho {
  private readonly ORGANIZATION_ID = "60002513198";
  private readonly BASE_URL_CRM = "https://www.zohoapis.in/crm/v2";
  private readonly BASE_URL_BOOKS = "https://books.zoho.in/api/v3";
  private readonly BASE_URL_ACCOUNTS = "https://accounts.zoho.in/oauth/v2";

  constructor() {
    // Constructor - equivalent to PHP __construct()
  }

  /**
   * Get Contact ID using Book API
   * EXACT same as PHP function GetContactIdUsingBookAPI() lines 10-29
   */
  async GetContactIdUsingBookAPI(zcrmContactId: string, authtoken: string): Promise<any> {
    const url = `${this.BASE_URL_BOOKS}/crm/contact/${zcrmContactId}/import?organization_id=${this.ORGANIZATION_ID}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${authtoken}`,
        'Content-Type': 'text/plain',
      }
    });

    return await response.text();
  }

  /**
   * Get Invoice Access Token
   * EXACT same as PHP function GetInvoiceAccessToken() lines 30-45
   */
  async GetInvoiceAccessToken(): Promise<ZohoTokenResponse> {
    const url = `${this.BASE_URL_ACCOUNTS}/token?refresh_token=1000.9c809b6ebcfd2415829d3cf2989d23a3.dc4e21f75afd1f33061b6f6cf21641e2&client_id=1000.K28FGXL9PRHJZYM18UWN4HM3KLD2KV&client_secret=c271c93232b4f1c7085d8656a520448f50bdddb707&grant_type=refresh_token`;
    
    const response = await fetch(url, {
      method: 'POST'
    });

    return await response.json();
  }

  /**
   * Create Invoice
   * EXACT same as PHP function createInvoice() lines 47-66
   */
  async createInvoice(data: string, authtoken: string): Promise<any> {
    const url = `${this.BASE_URL_BOOKS}/invoices?organization_id=${this.ORGANIZATION_ID}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${authtoken}`,
      },
      body: data
    });

    return await response.text();
  }

  /**
   * Get Contact Access Token
   * EXACT same as PHP function GetContactAccessToken() lines 68-83
   */
  async GetContactAccessToken(): Promise<ZohoTokenResponse> {
    const url = `${this.BASE_URL_ACCOUNTS}/token?refresh_token=1000.db635564240fb6968ba9e89841bda12c.2d1e1f50ac7c8b115d3bac409cb915a0&client_id=1000.K28FGXL9PRHJZYM18UWN4HM3KLD2KV&client_secret=c271c93232b4f1c7085d8656a520448f50bdddb707&grant_type=refresh_token`;
    
    const response = await fetch(url, {
      method: 'POST'
    });

    return await response.json();
  }

  /**
   * Contact Creation
   * EXACT same as PHP function ContactCreation() lines 85-107
   */
  async ContactCreation(value: ZohoContactData[], authtoken: string): Promise<any> {
    const data = { data: value };
    const jsonData = JSON.stringify(data);
    
    const response = await fetch(`${this.BASE_URL_CRM}/Contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${authtoken}`,
        'Content-Type': 'text/plain',
      },
      body: jsonData
    });

    return await response.text();
  }

  /**
   * Contact Updation
   * EXACT same as PHP function ContactUpdation() lines 109-139
   */
  async ContactUpdation(authtoken: string): Promise<void> {
    const recordID = '51788000007431242';
    const data1 = [{
      Email: 'nirmalavc07@gmail.com',
      First_Name: 'Nirmala',
      Last_Name: 'C',
      Phone: '8197411379',
      Account_Name: '51788000002384279'
    }];
    
    const data = { data: data1 };
    const jsonData = JSON.stringify(data);
    
    const response = await fetch(`${this.BASE_URL_CRM}/Contacts/${recordID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${authtoken}`,
        'Content-Type': 'text/plain',
      },
      body: jsonData
    });

    const result = await response.text();
    console.log(result); // Equivalent to PHP echo
  }

  /**
   * Deal Creation
   * EXACT same as PHP function DealCreation() lines 141-163
   */
  async DealCreation(value: ZohoDealData[], authtoken: string): Promise<any> {
    const data = { data: value };
    const jsonData = JSON.stringify(data);
    
    const response = await fetch(`${this.BASE_URL_CRM}/Deals/upsert`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${authtoken}`,
        'Content-Type': 'text/plain',
      },
      body: jsonData
    });

    return await response.text();
  }

  /**
   * Deal Updation
   * EXACT same as PHP function DealUpdation() lines 165-187
   */
  async DealUpdation(value: ZohoDealData[], authtoken: string): Promise<any> {
    const data = { data: value };
    const jsonData = JSON.stringify(data);
    
    const response = await fetch(`${this.BASE_URL_CRM}/Deals/upsert`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${authtoken}`,
        'Content-Type': 'text/plain',
      },
      body: jsonData
    });

    return await response.text();
  }

  /**
   * Get Search Data Access Token
   * EXACT same as PHP function GetSearchDataAccessToken() lines 189-204
   */
  async GetSearchDataAccessToken(): Promise<ZohoTokenResponse> {
    const url = `${this.BASE_URL_ACCOUNTS}/token?client_id=1000.5MM37ZZHJH20T9BCDGFOEA2J6YGDAV&grant_type=refresh_token&client_secret=8295be50146757c8c50f424fe52d5ea9b2e403731f&refresh_token=1000.586790e39fa145cec1826b62b1677f7d.42e18456122900b8c08e9611e862c125`;
    
    const response = await fetch(url, {
      method: 'POST'
    });

    return await response.json();
  }

  /**
   * Search Data by PAN Number
   * EXACT same as PHP function searchData() lines 206-226
   */
  async searchData(panNumber: string, authtoken: string): Promise<any> {
    const query = {
      select_query: `select Pan_Number, First_Name, Full_Name, Created_Time from Contacts where Pan_Number in(${panNumber})`
    };
    
    const response = await fetch(`${this.BASE_URL_CRM}/coql`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${authtoken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    });

    return await response.text();
  }

  /**
   * Search Deal ID Data
   * EXACT same as PHP function searchDealIDData() lines 228-248
   */
  async searchDealIDData(dealName: string, authtoken: string): Promise<any> {
    const query = {
      select_query: `select Pan_Number, Product1, Academic_Year,Deal_Name,Program_Details_ID,Created_Time,ASSET_Qualifying_Year from Deals where Deal_Name in(${dealName})`
    };
    
    const response = await fetch(`${this.BASE_URL_CRM}/coql`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${authtoken}`,
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(query)
    });

    return await response.text();
  }

  /**
   * Score Creation
   * EXACT same as PHP function scoreCreation() lines 249-273
   */
  async scoreCreation(value: any[]): Promise<any> {
    const result = await this.GetContactAccessToken();
    const authtoken = result.access_token;
    
    const data = { data: value };
    const jsonData = JSON.stringify(data);
    
    const response = await fetch(`${this.BASE_URL_CRM}/GEC_Student_Score`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${authtoken}`,
        'Content-Type': 'text/plain',
      },
      body: jsonData
    });

    return await response.text();
  }

  /**
   * Payment Paid Status
   * EXACT same as PHP function paymentPaidStatus() lines 275-291
   */
  async paymentPaidStatus(data: string, authtoken: string): Promise<any> {
    const url = `${this.BASE_URL_BOOKS}/customerpayments?organization_id=${this.ORGANIZATION_ID}&authtoken=bbae0251a6f9ac64c66be8d8bc17223f`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: data
    });

    return await response.text();
  }

  /**
   * HELPER METHODS FOR ATS INTEGRATION
   * These methods provide convenient interfaces for the ATS system
   */

  /**
   * Create or update contact for ATS registration
   */
  async createOrUpdateATSContact(contactData: ZohoContactData): Promise<any> {
    try {
      const tokenResponse = await this.GetContactAccessToken();
      return await this.ContactCreation([contactData], tokenResponse.access_token);
    } catch (error) {
      console.error('Failed to create/update ATS contact:', error);
      throw error;
    }
  }

  /**
   * Create or update deal for ATS registration
   */
  async createOrUpdateATSDeal(dealData: ZohoDealData): Promise<any> {
    try {
      const tokenResponse = await this.GetContactAccessToken();
      return await this.DealCreation([dealData], tokenResponse.access_token);
    } catch (error) {
      console.error('Failed to create/update ATS deal:', error);
      throw error;
    }
  }

  /**
   * Search for existing contact by PAN number
   */
  async findContactByPAN(panNumber: string): Promise<any> {
    try {
      const tokenResponse = await this.GetSearchDataAccessToken();
      return await this.searchData(`'${panNumber}'`, tokenResponse.access_token);
    } catch (error) {
      console.error('Failed to search contact by PAN:', error);
      throw error;
    }
  }

  /**
   * Search for existing deal by name
   */
  async findDealByName(dealName: string): Promise<any> {
    try {
      const tokenResponse = await this.GetSearchDataAccessToken();
      return await this.searchDealIDData(`'${dealName}'`, tokenResponse.access_token);
    } catch (error) {
      console.error('Failed to search deal by name:', error);
      throw error;
    }
  }
}

// Export singleton instance for use across the application
export const zohoClient = new ClsZoho();

// Export default for backward compatibility
export default ClsZoho;
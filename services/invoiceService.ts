import { Invoice, InvoiceHistoryItem } from '../types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzq0Z-C3hl246XuueAJLFTOq56SlwTJN_0KjbGDNS6jI2TsiGFT5T1cnqfLU1D-Y4_8-A/exec'; // استخدم الرابط الأخير الذي يعمل لديك

/**
 * Sends the complete invoice data to the Google Apps Script backend.
 */
export const saveInvoiceToDrive = async (invoiceData: Invoice & { subtotal: number; tax: number; total: number; }) => {
  console.log("Starting invoice save process...");
  
  // We send the data as a simple string within a FormData object
  // This is a reliable way to bypass CORS issues with Apps Script
  const formData = new FormData();
  formData.append('invoiceData', JSON.stringify(invoiceData));
  
  console.log("Invoice data to be sent:", invoiceData);
  
  try {
    console.log("Sending POST request to Google Apps Script at:", SCRIPT_URL);
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
      // We remove 'mode: no-cors' and headers completely to let the browser handle it
    });

    // Now we can actually read the response from the server
    const result = await response.json();
    console.log("Received response from server:", result);
    
    if (result.status !== 'success') {
      throw new Error(result.message || 'An unknown server error occurred.');
    }
    
    return result;

  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error; // Re-throw the error to be caught by the UI
  }
};

/**
 * Fetches the invoice history from the Google Apps Script backend.
 */
export const fetchInvoiceData = async (): Promise<InvoiceHistoryItem[]> => {
  try {
    const response = await fetch(SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    return []; 
  }
};
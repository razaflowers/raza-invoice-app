import { Invoice, InvoiceHistoryItem, Translation } from '../types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw8-sPi2TGBWtWUijLw_-HzRnRsf6L92CII6X5onJotmNFWLvCYajdL75vVD7TKoZ860g/exec';

/**
 * Sends invoice data to Google Apps Script and receives a PDF in return.
 */
export const createAndFetchInvoice = async (
  invoiceData: Invoice & { subtotal: number; tax: number; total: number; },
  language: string,
  t: Translation // إرسال كائن الترجمة
) => {
  console.log("Sending invoice data to backend for PDF creation...");

  const payload = {
    invoiceData,
    language,
    t: { // إرسال النصوص المطلوبة فقط لتقليل الحجم
      shopName: language === 'ar' ? "محل رازا الورود للهدايا ": "Raza Flowers",
      fromShop: language === 'ar' ? "من رازا الورود للهدايا" : "from Raza Flowers",
      emailGreeting: language === 'ar' ? "مرحباً" : "Hello",
      emailBody: language === 'ar' ? "شكراً لتعاملكم معنا. تجدون الفاتورة مرفقة." : "Thank you for your business. Your invoice is attached.",
      emailClosing: language === 'ar' ? "مع تحيات" : "Best regards",
      invoiceTemplate: t.invoiceTemplate,
      invoicePage: t.invoicePage,
    }
  };

  const formData = new FormData();
  formData.append('payload', JSON.stringify(payload));

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.status !== 'success') {
      throw new Error(result.message || 'Server error');
    }
    return result; // Will contain { status, pdfUrl, pdfBase64 }

  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
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
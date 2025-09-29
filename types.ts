export type Page = 'splash' | 'home' | 'invoice' | 'card' | 'history';

export interface InvoiceItem {
  id: number;
  product: string;
  price: string;
}

export interface Invoice {
  invoiceNumber: string;
  items: InvoiceItem[];
  gregorianDate: string;
  hijriDate: string;
  isTaxable: boolean;
  vatNumber?: string;
  customerName?: string;
  customerMobile?: string;
  customerEmail?: string;
}

export interface InvoiceHistoryItem {
  invoiceNumber: string;
  customerMobile: string;
  date: string;
  total: string;
  driveLink: string;
}

export type InvoicePaperSize = 'A4' | 'A5' | 'Thermal Receipt';
export type CardPaperSize = 'A6' | '4x6 inch';

export type CardStyle = 'Plain' | 'Decorated';
export type CardImageShape = 'square' | 'circle' | 'heart';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';

// Type for the translation object
export type Translation = {
  [key: string]: any;
};
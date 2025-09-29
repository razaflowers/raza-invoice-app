import React from 'react';
import { Invoice, InvoicePaperSize, Translation } from '../types';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import {
  LOGO_URL,
  MINISTRY_QR_CODE_URL,
  SHOP_NAME,
  SHOP_NAME_AR,
  SHOP_VAT_NUMBER,
  SHOP_INSTAGRAM_URL,
  SHOP_FACEBOOK_URL,
  SHOP_TIKTOK_URL,
  SHOP_LOCATION_URL,
  SHOP_WHATSAPP_URL
} from '../constants';

interface InvoiceTemplateProps {
  invoice: Invoice;
  paperSize: InvoicePaperSize;
  invoiceQrData: string;
  t: Translation;
  language: string;
}

const socialLinks = [
  { name: 'Instagram', url: SHOP_INSTAGRAM_URL },
  { name: 'TikTok', url: SHOP_TIKTOK_URL },
  { name: 'Facebook', url: SHOP_FACEBOOK_URL },
  { name: 'Location', url: SHOP_LOCATION_URL },
  { name: 'WhatsApp', url: SHOP_WHATSAPP_URL },
];

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice, paperSize, invoiceQrData, t, language }) => {
  const isRTL = language === 'ar';
  const paperSizeClass = {
    'A4': 'a4-size',
    'A5': 'a5-size',
    'Thermal Receipt': 'thermal-receipt-size',
  }[paperSize];

  return (
    <div className={`p-4 bg-white text-black shadow-lg mx-auto ${paperSizeClass}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="flex justify-between items-center border-b-2 border-black pb-4">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-4xl font-bold">{language === 'ar' ? SHOP_NAME_AR : SHOP_NAME}</h1>
          <h2 className="text-2xl">{t.invoiceTemplate.invoice}</h2>
          {invoice.isTaxable && invoice.vatNumber && <p>{t.invoiceTemplate.vatNumber}: {invoice.vatNumber}</p>}
        </div>
        <img src={LOGO_URL} alt="Shop Logo" className="w-24 h-24 object-contain" />
      </header>

      <section className="flex justify-between my-6">
        <div>
          <h3 className="font-bold mb-1">{t.invoiceTemplate.billTo}</h3>
          <p>{invoice.customerName}</p>
          <p>{invoice.customerMobile}</p>
          <p>{invoice.customerEmail}</p>
        </div>
        <div className={isRTL ? 'text-left' : 'text-right'}>
          <p><strong>{t.invoicePage.invoiceNumber}:</strong> {invoice.invoiceNumber}</p>
          <p><strong>{t.invoicePage.gregorianDate}:</strong> {invoice.gregorianDate}</p>
          <p><strong>{t.invoicePage.hijriDate}:</strong> {invoice.hijriDate}</p>
        </div>
      </section>

      <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse mb-8`}>
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300">{t.invoiceTemplate.productService}</th>
            <th className="p-2 border border-gray-300 w-32">{t.invoiceTemplate.price}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map(item => (
            <tr key={item.id}>
              <td className="p-2 border border-gray-300">{item.product}</td>
              <td className="p-2 border border-gray-300">{parseFloat(item.price || '0').toFixed(2)} SAR</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mb-8`}>
        <div className="w-64">
          <div className="flex justify-between">
            <span>{t.invoiceTemplate.subtotal}:</span>
            <span>{invoice.items.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0).toFixed(2)} SAR</span>
          </div>
          {invoice.isTaxable && (
            <div className="flex justify-between">
              <span>{t.invoiceTemplate.tax} (15%):</span>
              <span>{(invoice.items.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0) * 0.15).toFixed(2)} SAR</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t border-black mt-2 pt-2">
            <span>{t.invoiceTemplate.total}:</span>
            <span>
              {(
                invoice.items.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0) * (invoice.isTaxable ? 1.15 : 1)
              ).toFixed(2)} SAR
            </span>
          </div>
        </div>
      </section>
      
      <footer className="pt-4 mt-auto border-t-2 border-black">
        <div className="flex justify-between items-end">
          <div className="text-center">
            <p className="font-bold mb-2">{t.invoiceTemplate.thankYou}</p>
            <div className="flex gap-3 justify-center">
              {socialLinks.map(link => (
                <div key={link.name}>
                  <QRCode value={link.url} size={40} level="L" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            {invoice.isTaxable && invoiceQrData && <QRCode value={invoiceQrData} size={80} />}
            <img src={MINISTRY_QR_CODE_URL} alt="Ministry QR Code" className="w-16 h-16" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InvoiceTemplate;
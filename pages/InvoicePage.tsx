
import React, { useState, useMemo, useRef } from 'react';
import { Page, InvoiceItem, InvoicePaperSize, Invoice, Translation } from '../types';
import { 
  TAX_RATE,
  SHOP_NAME_AR, SHOP_VAT_NUMBER
} from '../constants';
import { saveInvoiceToDrive } from '../services/invoiceService';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import InvoiceTemplate from '../components/InvoiceTemplate';
import { generateInvoiceQrCode } from '../services/qrService';
import { HomeIcon } from '../components/icons';

interface InvoicePageProps {
  navigate: (page: Page) => void;
  t: Translation;
  language: string; 
}

const InvoicePage: React.FC<InvoicePageProps> = ({ navigate, t, language }) => { 
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ id: 1, product: '', price: '' }]);
  const [paperSize, setPaperSize] = useState<InvoicePaperSize>('A4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTaxable, setIsTaxable] = useState(false);
  const [vatNumber, setVatNumber] = useState('');

  const printRef = useRef<HTMLDivElement>(null);

  const gregorianDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const hijriDate = new Date().toLocaleDateString('ar-SA-u-ca-islamic', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  });

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), product: '', price: '' }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: 'product' | 'price', value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const { subtotal, tax, total } = useMemo(() => {
    const sub = items.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
    if (!isTaxable) {
      return { subtotal: sub, tax: 0, total: sub };
    }
    const taxAmount = sub * TAX_RATE;
    const totalAmount = sub + taxAmount;
    return { subtotal: sub, tax: taxAmount, total: totalAmount };
  }, [items, isTaxable]);

  const shopQrData = `https://razaflowers.com`; // Simplified QR for shop info

  const invoiceQrData = useMemo(() => {
    if (!isTaxable || !vatNumber) return '';
    return generateInvoiceQrCode(
      SHOP_NAME_AR,
      vatNumber,
      new Date().toISOString(),
      total.toFixed(2),
      tax.toFixed(2)
    );
  }, [total, tax, isTaxable, vatNumber]);
  
  const invoiceData: Invoice = { invoiceNumber, items, gregorianDate, hijriDate, isTaxable, vatNumber, customerName, customerMobile, customerEmail };

  const handlePrintAndSave = async () => {
    if (!printRef.current) return;

    // Basic validation
    if (!invoiceNumber || items.some(item => !item.product || !item.price)) {
      alert(t.invoicePage.validationError); // تأكد من إضافة هذا النص للترجمة
      return;
    }

    setIsProcessing(true);

    try {
      //
      // هذا هو الكائن الكامل الذي سيتم إرساله للسكربت
      //
      const fullInvoiceData = {
        ...invoiceData,
        subtotal,
        tax,
        total,
      };

      const response = await saveInvoiceToDrive(fullInvoiceData);

      if (response.status === 'success') {
        alert(t.invoicePage.saveSuccess); // تأكد من إضافة هذا النص للترجمة
        window.print();
      } else {
        throw new Error('Failed to save data to the server.');
      }

    } catch (error: any) {
      console.error("An error occurred during the print and save process:", error);
      alert(`${t.invoicePage.saveError}: ${error.message}`); // تأكد من إضافة هذا النص للترجمة
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">{t.invoicePage.title}</h1>
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
          aria-label={t.common.backToHome}
        >
          <HomeIcon />
          <span>{t.common.backToHome}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-semibold text-lg">{gregorianDate}</p>
              <p className="font-cairo text-md text-gray-600 dark:text-gray-400">{hijriDate}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <label htmlFor="invoice-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.invoicePage.invoiceNumber}</label>
              <input
                id="invoice-number"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g., 101"
                className="mt-1 block w-full border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm p-2"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.invoicePage.customerDetails}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.invoicePage.customerName}</label>
                <input id="customer-name" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={t.invoicePage.customerNamePlaceholder} className="mt-1 block w-full border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm p-2" />
              </div>
              <div>
                <label htmlFor="customer-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.invoicePage.customerMobile}</label>
                <input id="customer-mobile" type="text" value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} placeholder={t.invoicePage.customerMobilePlaceholder} className="mt-1 block w-full border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm p-2" />
              </div>
              <div>
                <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.invoicePage.customerEmail}</label>
                <input id="customer-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder={t.invoicePage.customerEmailPlaceholder} className="mt-1 block w-full border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm p-2" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`${t.invoicePage.itemPlaceholder} ${index + 1}`}
                  value={item.product}
                  onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                  className="flex-grow border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm p-2"
                />
                <input
                  type="number"
                  placeholder={t.invoicePage.pricePlaceholder}
                  value={item.price}
                  onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                  className="w-28 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm p-2"
                />
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
            <button onClick={handleAddItem} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition">
              {t.invoicePage.addItem}
            </button>
          </div>

        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">{t.invoicePage.summary}</h2>
            <div className="space-y-2">
              <div className="flex justify-between"><span>{t.invoicePage.subtotal}:</span> <span>{subtotal.toFixed(2)} SAR</span></div>
              {isTaxable && (
                <div className="flex justify-between"><span>{t.invoicePage.tax} ({TAX_RATE * 100}%):</span> <span>{tax.toFixed(2)} SAR</span></div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 border-gray-200 dark:border-gray-700"><span>{t.invoicePage.total}:</span> <span>{total.toFixed(2)} SAR</span></div>
            </div>
             <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isTaxable}
                        onChange={(e) => setIsTaxable(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:bg-gray-900 dark:border-gray-600 dark:checked:bg-emerald-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{t.invoicePage.taxInvoice}</span>
                </label>
                {isTaxable && (
                    <div className="mt-2">
                        <label htmlFor="vat-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.invoicePage.vatNumber}</label>
                        <input
                            id="vat-number"
                            type="text"
                            value={vatNumber}
                            onChange={(e) => setVatNumber(e.target.value)}
                            placeholder={t.invoicePage.vatNumberPlaceholder}
                            className="mt-1 block w-full border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm p-2"
                        />
                    </div>
                )}
            </div>
            <div className="mt-6 flex justify-center bg-white p-2 rounded-md">
              <QRCode value={shopQrData} size={128} />
            </div>
          </div>
          
          <div className="mt-6">
            <label htmlFor="paper-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.invoicePage.paperSize}</label>
            <select
              id="paper-size"
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as InvoicePaperSize)}
              className="mt-1 block w-full p-2 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option>A4</option>
              <option>A5</option>
              <option>Thermal Receipt</option>
            </select>
            <button
              onClick={handlePrintAndSave}
              disabled={isProcessing}
              className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg mt-4 hover:bg-emerald-800 transition shadow-lg disabled:bg-emerald-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? t.invoicePage.printing : t.invoicePage.printButton}
            </button>
          </div>
        </div>
      </div>
      <div className="print-container">
        <div ref={printRef}>
          <InvoiceTemplate 
            invoice={invoiceData} 
            paperSize={paperSize} 
            shopQrData={shopQrData}
            invoiceQrData={invoiceQrData} 
            t={t} 
            language={language} 
          />
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
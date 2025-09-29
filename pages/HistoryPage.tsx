import React, { useState, useEffect } from 'react';
import { Page, InvoiceHistoryItem, Translation } from '../types';
import { fetchInvoiceData } from '../services/invoiceService';
import { HomeIcon } from '../components/icons';

interface HistoryPageProps {
  navigate: (page: Page) => void;
  t: Translation;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ navigate, t }) => {
  const [invoices, setInvoices] = useState<InvoiceHistoryItem[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchInvoiceData();
        setInvoices(data);
        setFilteredInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoice data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = invoices.filter(item => {
      // This is the fix: Ensure values are strings before calling toLowerCase
      const invoiceNumber = String(item.invoiceNumber || '').toLowerCase();
      const customerMobile = String(item.customerMobile || '').toLowerCase();
      return invoiceNumber.includes(lowercasedFilter) || customerMobile.includes(lowercasedFilter);
    });
    setFilteredInvoices(filteredData);
  }, [searchTerm, invoices]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">{t.historyPage.title}</h1>
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
          aria-label={t.common.backToHome}
        >
          <HomeIcon />
          <span>{t.common.backToHome}</span>
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.historyPage.searchPlaceholder}
          className="w-full max-w-md p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
        {loading ? (
          <div className="text-center p-8">{t.historyPage.loading}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.historyPage.invoiceNumber}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.historyPage.date}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.historyPage.customerMobile}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.historyPage.total}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.historyPage.link}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.invoiceNumber + invoice.date}>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.customerMobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={invoice.driveLink} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
                      {t.historyPage.viewLink}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
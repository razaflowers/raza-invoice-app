import React from 'react';
import { Page, Translation } from '../types';

interface HomePageProps {
  navigate: (page: Page) => void;
  t: Translation;
}

const HomePage: React.FC<HomePageProps> = ({ navigate, t }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          onClick={() => navigate('invoice')}
          className="col-span-1 md:col-span-2 bg-emerald-700 text-white py-6 px-8 rounded-lg shadow-lg hover:bg-emerald-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
        >
          <span className="text-2xl font-bold tracking-wide">{t.homePage.createInvoice.en}</span>
          <span className="block text-xl font-cairo mt-1">{t.homePage.createInvoice.ar}</span>
        </button>

        <button
          onClick={() => navigate('card')}
          className="bg-white text-emerald-700 border-2 border-emerald-700 dark:bg-gray-800 dark:text-emerald-300 dark:border-emerald-500 py-6 px-8 rounded-lg shadow-lg hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
        >
          <span className="text-xl font-bold tracking-wide">{t.homePage.createCard.en}</span>
          <span className="block text-lg font-cairo mt-1">{t.homePage.createCard.ar}</span>
        </button>
        
        <button
          onClick={() => navigate('history')}
          className="bg-white text-emerald-700 border-2 border-emerald-700 dark:bg-gray-800 dark:text-emerald-300 dark:border-emerald-500 py-6 px-8 rounded-lg shadow-lg hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
        >
          <span className="text-xl font-bold tracking-wide">{t.homePage.invoiceHistory.en}</span>
          <span className="block text-lg font-cairo mt-1">{t.homePage.invoiceHistory.ar}</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
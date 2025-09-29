
import React, { useState, useCallback, useEffect } from 'react';
import { Page, Theme, Language } from './types';
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import InvoicePage from './pages/InvoicePage';
import CardPage from './pages/CardPage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';
import { translations } from './translations';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('splash');
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  
  const t = translations[language];

  const renderPage = () => {
    const pageProps = { navigate: handleNavigate, t, language };
    switch (currentPage) {
      case 'splash':
        return <SplashScreen onFinish={() => handleNavigate('home')} />;
      case 'home':
        return <HomePage {...pageProps} />;
      case 'invoice':
        return <InvoicePage {...pageProps} />;
      case 'card':
        return <CardPage {...pageProps} />;
      case 'history':
        return <HistoryPage {...pageProps} />;
      default:
        return <HomePage {...pageProps} />;
    }
  };

  return (
    <main className="bg-gray-200 dark:bg-gray-900 min-h-screen w-full text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {currentPage !== 'splash' && (
        <Navbar 
          theme={theme}
          toggleTheme={toggleTheme}
          language={language}
          toggleLanguage={toggleLanguage}
          t={t}
          navigate={handleNavigate}
        />
      )}
      <div className={currentPage !== 'splash' ? 'pt-20' : ''}>
        {renderPage()}
      </div>
    </main>
  );
};

export default App;
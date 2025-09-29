
import React from 'react';
import { Theme, Language, Translation, Page } from '../types';
import Logo from './Logo';
import { SunIcon, MoonIcon } from './icons';

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: Translation;
  navigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, language, toggleLanguage, t, navigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('home')}
          >
            <Logo className="w-14 h-14" />
            <span className="ms-3 text-xl font-semibold text-emerald-800 dark:text-emerald-300 hidden sm:block">
              Raza Flowers
            </span>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle Language"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-emerald-500"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
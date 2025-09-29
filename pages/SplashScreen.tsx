
import React, { useEffect } from 'react';
import Logo from '../components/Logo';
import { SHOP_NAME, SHOP_NAME_AR } from '../constants';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="animate-fade-in-pulse">
        <Logo className="w-48 h-48" />
      </div>
      <div className="text-center mt-6 animate-fade-in">
        <h1 className="text-2xl font-semibold text-emerald-800 tracking-wider">
          {SHOP_NAME} Invoicing System
        </h1>
        <p className="text-xl text-emerald-700 font-cairo mt-2">
          نظام فواتير {SHOP_NAME_AR}
        </p>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInPulse {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-in-out forwards;
        }
        .animate-fade-in-pulse {
          animation: fadeInPulse 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;


import React from 'react';
import { LOGO_URL } from '../constants';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'w-32 h-32' }) => {
  return (
    <img src={LOGO_URL} alt="Raza Flowers Logo" className={`object-contain filter drop-shadow-md ${className}`} />
  );
};

export default Logo;
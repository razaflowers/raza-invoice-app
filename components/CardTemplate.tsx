import React from 'react';
import { CardPaperSize, CardStyle, CardImageShape } from '../types';
import { LOGO_URL } from '../constants';

interface CardTemplateProps {
  message: string;
  fontClass: string;
  textColor: string;
  image: string | null;
  cardStyle: CardStyle;
  decoration: string;
  paperSize: CardPaperSize;
  imageSize?: number;
  imageShape?: CardImageShape;
  fontSize?: number;
  isPreview?: boolean;
  contentPositionY: number; // Single prop for the entire content block's vertical position
}

const CardTemplate: React.FC<CardTemplateProps> = ({
  message,
  fontClass,
  textColor,
  image,
  cardStyle,
  decoration,
  paperSize,
  imageSize = 1,
  imageShape = 'square',
  fontSize = 32,
  isPreview = false,
  contentPositionY, // Destructure the single position prop
}) => {
  const sizeClasses = {
    'A6': 'a6-size',
    '4x6 inch': 'four-by-six-size',
  };

  const previewSizeClasses = {
    'A6': 'w-[105mm] h-[148mm]',
    '4x6 inch': 'w-[4in] h-[6in]',
  };
  
  const isDecorated = cardStyle === 'Decorated';
  const textShadow = { textShadow: '0 2px 5px rgba(0, 0, 0, 0.6)' };

  const heartClipPath = {
    clipPath: 'polygon(50% 95%, 85% 65%, 100% 30%, 85% 0%, 50% 15%, 15% 0%, 0% 30%, 15% 65%)',
  };

  const shapeClasses = {
    square: 'rounded-md',
    circle: 'rounded-full',
    heart: '', // Uses inline style
  };

  return (
    <div
      className={`relative bg-white shadow-lg text-center overflow-hidden
        ${isPreview ? `${previewSizeClasses[paperSize]} transform scale-90` : sizeClasses[paperSize]}`}
    >
      {/* Background Decoration */}
      {isDecorated && (
        <img src={decoration} className="absolute inset-0 w-full h-full object-cover z-0" alt="Card Background" />
      )}

      {/* Logo at the Top */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <img 
            src={LOGO_URL} 
            alt="Raza Flowers Logo" 
            className="w-20 h-20 object-contain" 
            style={{ filter: 'drop-shadow(0 3px 4px rgba(0, 0, 0, 0.5))' }} 
        />
        <div className="text-center -mt-2">
            <p className="font-dancing-script text-pink-500 text-lg" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>Raza Flowers</p>
            <p className="font-amiri text-pink-500 text-base" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>رازا للورود</p>
        </div>
      </div>

      {/* Main Content Container (Image + Text) */}
      <div
        className="absolute left-1/2 w-full px-8 z-10 flex flex-col items-center gap-4"
        style={{ 
          top: `${contentPositionY}%`, // Applied vertical position to the whole container
          transform: `translate(-50%, -50%)` // Center the container
        }}
      >
        {/* User-Uploaded Image */}
        {image && (
          <div className="w-40 h-40 flex items-center justify-center">
            <img 
              src={image} 
              alt="user uploaded content" 
              className={`w-full h-full object-cover shadow-md ${shapeClasses[imageShape]}`}
              style={{ 
                transform: `scale(${imageSize})`,
                ...(imageShape === 'heart' ? heartClipPath : {})
              }}
            />
          </div>
        )}

        {/* Message Text */}
        <p 
          className={`whitespace-pre-wrap ${fontClass}`}
          style={{ color: textColor, fontSize: `${fontSize}px`, ...textShadow }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default CardTemplate;
import React, { useState, useRef, useEffect } from 'react';
import { Page, CardPaperSize, CardStyle, Translation, CardImageShape } from '../types';
import CardTemplate from '../components/CardTemplate';
import { suggestCardMessage } from '../services/geminiService';
import { HomeIcon } from '../components/icons';

interface CardPageProps {
  navigate: (page: Page) => void;
  t: Translation;
  language: string;
}

const decorations = [
  { id: 1, url: 'https://i.imgur.com/yLYqTad.png' },
  { id: 2, url: 'https://i.imgur.com/JK7WYJR.png' },
  { id: 3, url: 'https://i.imgur.com/V8CKk7W.png' },
  { id: 4, url: 'https://i.imgur.com/2RbirwD.png' },
  { id: 5, url: 'https://i.imgur.com/Tx2NrFr.png' },
  { id: 6, url: 'https://i.imgur.com/0vhnZwb.png' }
];

const CardPage: React.FC<CardPageProps> = ({ navigate, t, language }) => {
  const englishDefaultMessage = 'With love and best wishes.';
  const arabicDefaultMessage = 'مع كل الحب وأطيب الأمنيات.';

  const [message, setMessage] = useState(language === 'ar' ? arabicDefaultMessage : englishDefaultMessage);
  const [font, setFont] = useState('font-playfair-display');
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#ffffff');
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState(1);
  const [imageShape, setImageShape] = useState<CardImageShape>('square');
  const [cardStyle, setCardStyle] = useState<CardStyle>('Decorated');
  const [decoration, setDecoration] = useState(decorations[0].url);
  const [paperSize, setPaperSize] = useState<CardPaperSize>('A6');
  const [isLoading, setIsLoading] = useState(false);
  
  // A single state for the vertical position of the entire content block
  const [contentPositionY, setContentPositionY] = useState(55);

  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (message === englishDefaultMessage || message === arabicDefaultMessage) {
      setMessage(language === 'ar' ? arabicDefaultMessage : englishDefaultMessage);
    }
  }, [language, message]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePrintCard = () => {
    window.print();
  };
  
  const handleSuggestMessage = async () => {
    setIsLoading(true);
    try {
        const suggestedMessage = await suggestCardMessage(language);
        setMessage(suggestedMessage);
    } catch (error) {
        console.error("Error suggesting message:", error);
        alert("Could not suggest a message at this time.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">{t.cardPage.title}</h1>
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
        <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.message}</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm p-2"
                />
                <button
                    onClick={handleSuggestMessage}
                    disabled={isLoading}
                    className="mt-2 w-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    {isLoading ? t.cardPage.loading : t.cardPage.suggestMessage}
                </button>
            </div>

            {/* Font, Font Size, and Text Color controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.font}</label>
              <select onChange={(e) => setFont(e.target.value)} value={font} className="mt-1 block w-full p-2 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm">
                <optgroup label="English"><option value="font-playfair-display" className="font-playfair-display">Playfair Display</option><option value="font-dancing-script" className="font-dancing-script">Dancing Script</option><option value="font-montserrat" className="font-montserrat">Montserrat</option></optgroup>
                <optgroup label="Arabic"><option value="font-amiri" className="font-amiri">Amiri</option><option value="font-cairo" className="font-cairo">Cairo</option><option value="font-lateef" className="font-lateef">Lateef</option></optgroup>
              </select>
            </div>
            <div>
              <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.fontSize}</label>
              <input id="font-size" type="range" min="16" max="48" step="1" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">{fontSize}px</div>
            </div>
            <div>
              <label htmlFor="text-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.textColor}</label>
              <input id="text-color" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="mt-1 block w-full h-10 p-1 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm cursor-pointer"/>
            </div>

            {/* Single slider for content position with a translated label */}
            <div>
              <label htmlFor="content-position-y" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.contentPosition}</label>
              <input id="content-position-y" type="range" min="0" max="100" value={contentPositionY} onChange={(e) => setContentPositionY(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
            </div>

            {/* Card Style and Decoration controls */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.style}</label>
                <div className="flex gap-2 mt-1"><button onClick={() => setCardStyle('Plain')} className={`px-4 py-2 rounded-md ${cardStyle === 'Plain' ? 'bg-emerald-700 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t.cardPage.plain}</button><button onClick={() => setCardStyle('Decorated')} className={`px-4 py-2 rounded-md ${cardStyle === 'Decorated' ? 'bg-emerald-700 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t.cardPage.decorated}</button></div>
            </div>
            {cardStyle === 'Decorated' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.decoration}</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">{decorations.map(d => (<img key={d.id} src={d.url} alt={`Decoration ${d.id}`} onClick={() => setDecoration(d.url)} className={`cursor-pointer rounded-md border-2 bg-gray-200 object-cover aspect-square ${decoration === d.url ? 'border-emerald-500' : 'border-transparent'} hover:border-emerald-300`} />))}</div>
                </div>
            )}
            
            {/* Image controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.image}</label>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="mt-1 w-full bg-gray-200 dark:bg-gray-600 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t.cardPage.uploadImage}</button>
              {image && (
                <>
                  <button onClick={() => setImage(null)} className="mt-1 w-full text-sm text-red-600 hover:underline">{t.cardPage.removeImage}</button>
                  <div className="mt-4">
                    <label htmlFor="image-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.imageSize}</label>
                    <input id="image-size" type="range" min="0.5" max="2" step="0.1" value={imageSize} onChange={(e) => setImageSize(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                     <div className="text-center text-sm text-gray-500 dark:text-gray-400">{(imageSize * 100).toFixed(0)}%</div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.imageShape}</label>
                    <div className="flex gap-2 mt-1"><button onClick={() => setImageShape('square')} className={`px-4 py-2 rounded-md ${imageShape === 'square' ? 'bg-emerald-700 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t.cardPage.square}</button><button onClick={() => setImageShape('circle')} className={`px-4 py-2 rounded-md ${imageShape === 'circle' ? 'bg-emerald-700 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t.cardPage.circle}</button><button onClick={() => setImageShape('heart')} className={`px-4 py-2 rounded-md ${imageShape === 'heart' ? 'bg-emerald-700 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t.cardPage.heart}</button></div>
                  </div>
                </>
              )}
            </div>

             <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cardPage.paperSize}</label>
                 <select onChange={(e) => setPaperSize(e.target.value as CardPaperSize)} value={paperSize} className="mt-1 block w-full p-2 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm"><option>A6</option><option>4x6 inch</option></select>
                <button 
                  onClick={handlePrintCard} 
                  className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg mt-4 hover:bg-emerald-800 transition shadow-lg"
                >
                  {t.cardPage.printButton}
                </button>
            </div>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center bg-gray-200 dark:bg-gray-900/50 p-6 rounded-lg shadow-inner min-h-[60vh]">
          <CardTemplate
            {...{message, fontClass: font, fontSize, textColor, image, imageSize, imageShape, cardStyle, decoration, paperSize}}
            isPreview={true}
            contentPositionY={contentPositionY} // Pass the single position prop
          />
        </div>
      </div>

       <div className="print-container">
        <div ref={printRef}>
          <CardTemplate
            {...{message, fontClass: font, fontSize, textColor, image, imageSize, imageShape, cardStyle, decoration, paperSize}}
            contentPositionY={contentPositionY} // Pass the single position prop
          />
        </div>
      </div>
    </div>
  );
};

export default CardPage;
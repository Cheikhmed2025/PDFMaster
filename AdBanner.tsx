'use client';

import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cette fonction serait appelée si nous avions un code AdSense spécifique à insérer
    // Pour l'instant, nous utilisons juste le script global dans le layout
    try {
      // @ts-ignore
      if (window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    }
  }, []);

  return (
    <div 
      ref={adContainerRef}
      className={`w-full overflow-hidden bg-gray-100 text-center my-4 ${className}`}
      style={{ minHeight: '90px' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8362325364175470"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <p className="text-xs text-gray-400 mt-1">Publicité</p>
    </div>
  );
};

export default AdBanner;

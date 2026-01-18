import React, { useState } from 'react';
import { FaTimes, FaFlask } from 'react-icons/fa';

const BetaBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-3 px-4 relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Contenu */}
        <div className="flex items-center space-x-3 flex-1">
          <FaFlask className="text-2xl animate-bounce" />
          <div>
            <p className="font-bold text-sm md:text-base">
              Version BÊTA - Site en test
            </p>
            <p className="text-xs md:text-sm opacity-90">
              Aidez-nous à améliorer l'application ! Vos retours comptent 
            </p>
          </div>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default BetaBanner;
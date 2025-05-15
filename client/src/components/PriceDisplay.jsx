import { useState, useEffect } from 'react';

const PriceDisplay = ({ price, time, symbol }) => {
  const [priceDirection, setPriceDirection] = useState(null);
  const [lastPrice, setLastPrice] = useState(null);

  useEffect(() => {
    if (lastPrice !== null) {
      if (price > lastPrice) {
        setPriceDirection('up');
      } else if (price < lastPrice) {
        setPriceDirection('down');
      }
      
      // Resetear la dirección después de 1 segundo
      const timer = setTimeout(() => {
        setPriceDirection(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    setLastPrice(price);
  }, [price, lastPrice]);

  // Dirección del precio para cambiar el color
  const directionClasses = {
    up: 'text-green-500 animate-pulse',
    down: 'text-red-500 animate-pulse',
    null: 'text-gray-800'
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Precio Actual</h2>
      
      <div className="text-center">
        <div className="mb-4">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {symbol || 'BTC/USDT'}
          </h3>
        </div>
        
        <div className={`text-5xl font-bold ${directionClasses[priceDirection]} transition-colors duration-300`}>
          {price ? price : '----.--'}
        </div>
        
        <div className="text-gray-500 mt-4 text-lg font-medium">
          {time ? time : '--:--:--'}
        </div>
      </div>
    </div>
  );
};

export default PriceDisplay; 
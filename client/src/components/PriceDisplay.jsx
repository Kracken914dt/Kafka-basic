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
    up: 'text-green-500',
    down: 'text-red-500',
    null: 'text-gray-800'
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Precio Actual</h2>
      
      <div className="text-center">
        <div className="mb-3">
          <h3 className="text-2xl font-bold">{symbol || 'BTC/USDT'}</h3>
        </div>
        
        <div className={`text-4xl font-bold ${directionClasses[priceDirection]}`}>
          {price ? price : '----.--'}
        </div>
        
        <div className="text-gray-500 mt-2">
          {time ? time : '--:--:--'}
        </div>
      </div>
    </div>
  );
};

export default PriceDisplay; 
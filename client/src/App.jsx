import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import KafkaDiagram from './components/KafkaDiagram';
import PriceChart from './components/PriceChart';
import PriceDisplay from './components/PriceDisplay';
import PartitionView from './components/PartitionView';
import PerformanceMetrics from './components/PerformanceMetrics';

function App() {
  const [priceData, setPriceData] = useState({
    price: null,
    time: null,
    symbol: 'BTC/USDT'
  });
  const [queueStatus, setQueueStatus] = useState({
    size: 0,
    topic: 'crypto-prices',
    partition: 0
  });
  const [priceHistory, setPriceHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [numPartitions, setNumPartitions] = useState(3);
  
  useEffect(() => {
    // Conectar al servidor WebSocket
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Conectado al servidor');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      setConnected(false);
    });

    // Recibir actualizaciones de precios
    socket.on('price-update', (data) => {
      setPriceData({
        price: parseFloat(data.price.price),
        time: data.price.time,
        symbol: data.price.symbol
      });
      
      setQueueStatus({
        size: data.queueStatus.size,
        topic: data.queueStatus.topic,
        partition: data.queueStatus.partition
      });
      
      setPriceHistory(data.history);
    });

    // Recibir actualizaciones de la cola
    socket.on('queue-update', (data) => {
      setQueueStatus(prev => ({
        ...prev,
        size: data.size
      }));
    });

    // Recibir datos históricos al conectar
    socket.on('historical-data', (history) => {
      if (history.length > 0) {
        setPriceHistory(history);
        
        // Actualizar con el último precio conocido
        const latestPrice = history[history.length - 1];
        if (latestPrice) {
          setPriceData({
            price: parseFloat(latestPrice.price),
            time: latestPrice.time,
            symbol: latestPrice.symbol
          });
        }
      }
    });

    // Limpiar al desmontar
    return () => {
      socket.disconnect();
    };
  }, []);

  const handlePartitionsChange = (newNumPartitions) => {
    setNumPartitions(newNumPartitions);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sistema de Colas Kafka - Precios de Criptomonedas
        </h1>
        <div className="text-center mt-2">
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {connected ? 'Conectado al servidor' : 'Desconectado'}
          </span>
        </div>
      </header>

      <div className="mb-8">
        <KafkaDiagram 
          queueSize={queueStatus.size} 
          topic={queueStatus.topic} 
          partition={queueStatus.partition}
          totalPartitions={numPartitions}
        />
      </div>

      <div className="mb-8">
        <PartitionView 
          messages={priceHistory}
          numPartitions={numPartitions}
          onPartitionsChange={handlePartitionsChange}
        />
      </div>

      <div className="mb-8">
        <PerformanceMetrics 
          numPartitions={numPartitions}
          messages={priceHistory}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <PriceDisplay 
            price={priceData.price} 
            time={priceData.time} 
            symbol={priceData.symbol} 
          />
        </div>
        <div className="md:col-span-2">
          <PriceChart priceHistory={priceHistory} />
        </div>
      </div>
    </div>
  );
}

export default App;

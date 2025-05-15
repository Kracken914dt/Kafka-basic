import { useEffect, useState, useRef } from 'react';

const KafkaDiagram = ({ queueSize, topic, partition }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const dataFlowRef = useRef(null);

  // Crear un punto de datos visual que se mueve por la cola
  const addDataPoint = () => {
    const id = Date.now();
    setDataPoints(prev => [...prev, id]);
    
    // Eliminar el punto después de la animación
    setTimeout(() => {
      setDataPoints(prev => prev.filter(pointId => pointId !== id));
    }, 2000);
  };

  // Añadir un punto cada vez que llegan nuevos datos
  useEffect(() => {
    addDataPoint();
  }, [queueSize]);

  // Calcular el ancho de la cola con un límite máximo
  const calculateQueueWidth = (size) => {
    // Ancho base
    const baseWidth = 150;
    // Incremento por mensaje (reducido para evitar expansión excesiva)
    const incrementPerMessage = 15;
    // Limitar a un máximo de 20 mensajes visibles (para el ancho)
    const effectiveSize = Math.min(size, 20);
    // Calcular ancho
    return baseWidth + (effectiveSize * incrementPerMessage);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg mb-8 transform hover:scale-[1.02] transition-transform duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Sistema de Colas Kafka</h2>
      
      <div className="relative h-[300px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-inner">

        <div className="absolute w-[120px] h-[90px] bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl flex items-center justify-center font-bold text-center top-[105px] left-[50px] shadow-lg hover:shadow-xl transition-shadow duration-300">
          Productor<br/>Binance
        </div>
        

        <div className="absolute h-[12px] w-[60px] bg-gradient-to-r from-gray-700 to-gray-800 top-[140px] left-[180px] rounded-r-full">
          <div className="absolute w-0 h-0 border-[12px] border-transparent border-l-gray-800 -right-[12px] -top-[6px]"></div>
        </div>
        

        <div 
          className="absolute h-[60px] bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-500 top-[115px] left-1/2 transform -translate-x-1/2 overflow-hidden shadow-lg hover:shadow-xl"
          style={{ width: `${calculateQueueWidth(queueSize)}px`, maxWidth: "60%" }}
        >
          Cola: {queueSize} msgs
        </div>
        

        <div className="absolute h-[12px] w-[60px] bg-gradient-to-r from-gray-700 to-gray-800 top-[140px] right-[180px] rounded-l-full">
          <div className="absolute w-0 h-0 border-[12px] border-transparent border-r-gray-800 -left-[12px] -top-[6px]"></div>
        </div>
        

        <div className="absolute w-[120px] h-[90px] bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl flex items-center justify-center font-bold text-center top-[105px] right-[50px] shadow-lg hover:shadow-xl transition-shadow duration-300">
          Consumidor<br/>Web
        </div>
        

        <div ref={dataFlowRef} className="absolute inset-0">
          {dataPoints.map(id => (
            <div 
              key={id}
              className="absolute w-[12px] h-[12px] bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-movePoint shadow-lg"
            />
          ))}
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg p-4 shadow-inner">
        <h3 className="font-semibold text-gray-700 mb-3">Estado actual:</h3>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2">
            <span className="text-gray-600">Tema:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{topic || 'crypto-prices'}</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-600">Partición:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{partition || '0'}</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-600">Mensajes en cola:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{queueSize || '0'}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KafkaDiagram; 
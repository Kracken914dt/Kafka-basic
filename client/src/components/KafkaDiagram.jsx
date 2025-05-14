import { useEffect, useState, useRef } from 'react';

const KafkaDiagram = ({ queueSize, topic, partition }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const dataFlowRef = useRef(null);
  const lastQueueSizeRef = useRef(0);

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
    <div className="bg-white rounded-lg p-6 shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Sistema de Colas Kafka</h2>
      
      <div className="relative h-[250px] bg-gray-50 rounded-lg border border-gray-200">
        {/* Productor */}
        <div className="absolute w-[100px] h-[80px] bg-slate-600 text-white rounded-lg flex items-center justify-center font-bold text-center top-[85px] left-[50px]">
          Productor<br/>Binance
        </div>
        
        {/* Flecha izquierda */}
        <div className="absolute h-[10px] w-[50px] bg-gray-700 top-[120px] left-[160px]">
          <div className="absolute w-0 h-0 border-[10px] border-transparent border-l-gray-700 -right-[10px] -top-[5px]"></div>
        </div>
        
        {/* Cola - con ancho limitado */}
        <div 
          className="absolute h-[50px] bg-blue-500 rounded flex items-center justify-center text-white font-bold transition-all duration-500 top-[100px] left-1/2 transform -translate-x-1/2 overflow-hidden"
          style={{ width: `${calculateQueueWidth(queueSize)}px`, maxWidth: "60%" }}
        >
          Cola: {queueSize} msgs
        </div>
        
        {/* Flecha derecha */}
        <div className="absolute h-[10px] w-[50px] bg-gray-700 top-[120px] right-[160px]">
          <div className="absolute w-0 h-0 border-[10px] border-transparent border-r-gray-700 -left-[10px] -top-[5px]"></div>
        </div>
        
        {/* Consumidor */}
        <div className="absolute w-[100px] h-[80px] bg-slate-600 text-white rounded-lg flex items-center justify-center font-bold text-center top-[85px] right-[50px]">
          Consumidor<br/>Web
        </div>
        
        {/* Puntos de datos en movimiento */}
        <div ref={dataFlowRef} className="absolute inset-0">
          {dataPoints.map(id => (
            <div 
              key={id}
              className="absolute w-[10px] h-[10px] bg-orange-500 rounded-full animate-movePoint"
            />
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-semibold text-gray-700">Estado actual:</h3>
        <ul className="list-disc pl-5 mt-2">
          <li>Tema: <span className="font-mono">{topic || 'crypto-prices'}</span></li>
          <li>Partición: <span className="font-mono">{partition || '0'}</span></li>
          <li>Mensajes en cola: <span className="font-mono">{queueSize || '0'}</span></li>
        </ul>
      </div>
    </div>
  );
};

export default KafkaDiagram; 
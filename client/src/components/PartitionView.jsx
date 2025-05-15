import { useState, useEffect } from 'react';

const PartitionView = ({ messages, numPartitions = 3, onPartitionsChange }) => {
  const [partitionData, setPartitionData] = useState([]);
  const [selectedPartitions, setSelectedPartitions] = useState(numPartitions);
  const [showAllPartitions, setShowAllPartitions] = useState(false);

  useEffect(() => {
    // Simular la distribución de mensajes en particiones
    const distributeMessages = () => {
      const partitions = Array(selectedPartitions).fill().map(() => ({
        messages: [],
        totalMessages: 0,
        lastMessage: null
      }));

      messages.forEach((message, index) => {
        // Distribuir mensajes entre particiones usando el índice
        const partitionIndex = index % selectedPartitions;
        partitions[partitionIndex].messages.push(message);
        partitions[partitionIndex].totalMessages++;
        partitions[partitionIndex].lastMessage = message;
      });

      setPartitionData(partitions);
    };

    distributeMessages();
  }, [messages, selectedPartitions]);

  const getGridColumns = () => {
    if (showAllPartitions) return `grid-cols-${selectedPartitions}`;
    return selectedPartitions <= 3 ? `grid-cols-${selectedPartitions}` : 'grid-cols-3';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3">
          Visualización de Particiones
        </h2>
        
        <div className="flex items-center space-x-4">
          <label htmlFor="partitions" className="text-sm font-medium text-gray-700">
            Número de Particiones:
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (selectedPartitions > 1) {
                  setSelectedPartitions(selectedPartitions - 1);
                  if (onPartitionsChange) onPartitionsChange(selectedPartitions - 1);
                }
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold focus:outline-none"
              aria-label="Disminuir particiones"
              disabled={selectedPartitions === 1}
            >
              -
            </button>
            <span className="w-8 text-center text-lg font-semibold text-gray-800 select-none">
              {selectedPartitions}
            </span>
            <button
              onClick={() => {
                if (selectedPartitions < 8) {
                  setSelectedPartitions(selectedPartitions + 1);
                  if (onPartitionsChange) onPartitionsChange(selectedPartitions + 1);
                }
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold focus:outline-none"
              aria-label="Aumentar particiones"
              disabled={selectedPartitions === 8}
            >
              +
            </button>
          </div>
          {selectedPartitions > 3 && (
            <button
              onClick={() => setShowAllPartitions(!showAllPartitions)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
            >
              {showAllPartitions ? 'Ver 3 columnas' : 'Ver todas'}
            </button>
          )}
        </div>
      </div>

      <div className={`relative ${selectedPartitions > 3 && !showAllPartitions ? 'overflow-x-auto' : ''}`}>
        <div className={`grid ${getGridColumns()} gap-6 min-w-max`}>
          {partitionData.map((partition, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-md transform hover:scale-[1.02] transition-transform duration-300 min-w-[300px]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Partición {index}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {partition.totalMessages} mensajes
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Último mensaje:</h4>
                  {partition.lastMessage ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Precio: {partition.lastMessage.price} USDT
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(partition.lastMessage.time).toLocaleTimeString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Sin mensajes</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Estadísticas:</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Tamaño: {partition.messages.length} mensajes
                    </p>
                    <p className="text-sm text-gray-600">
                      Promedio: {(partition.messages.reduce((acc, msg) => acc + parseFloat(msg.price), 0) / partition.messages.length || 0).toFixed(2)} USDT
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${(partition.totalMessages / messages.length) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Los mensajes se distribuyen automáticamente entre las particiones usando el operador módulo (%)</p>
      </div>
    </div>
  );
};

export default PartitionView; 
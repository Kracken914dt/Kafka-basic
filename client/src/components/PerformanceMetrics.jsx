import { useEffect, useState } from 'react';

const PerformanceMetrics = ({ numPartitions, messages }) => {
  const [metrics, setMetrics] = useState({
    throughput: 0,
    latency: 0,
    scalability: 0
  });

  useEffect(() => {
    // Calcular métricas basadas en el número de particiones y mensajes
    const calculateMetrics = () => {
      const baseThroughput = 1000; // mensajes por segundo base
      const baseLatency = 100; // ms base
      const baseScalability = 1; // factor de escalabilidad base

      // Calcular métricas simuladas
      const throughput = baseThroughput * (1 + (numPartitions - 1) * 0.5);
      const latency = baseLatency / (1 + (numPartitions - 1) * 0.3);
      const scalability = baseScalability * (1 + (numPartitions - 1) * 0.4);

      setMetrics({
        throughput,
        latency,
        scalability
      });
    };

    calculateMetrics();
  }, [numPartitions, messages]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">
        Métricas de Rendimiento y Escalabilidad
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Throughput</h3>
          <div className="text-3xl font-bold text-emerald-600">
            {metrics.throughput.toFixed(0)}
            <span className="text-sm font-normal text-gray-500 ml-2">msg/s</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Mensajes procesados por segundo
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Latencia</h3>
          <div className="text-3xl font-bold text-rose-600">
            {metrics.latency.toFixed(0)}
            <span className="text-sm font-normal text-gray-500 ml-2">ms</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Tiempo de procesamiento promedio
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Escalabilidad</h3>
          <div className="text-3xl font-bold text-blue-600">
            {metrics.scalability.toFixed(2)}x
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Factor de mejora con particiones
          </p>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Las métricas se actualizan en tiempo real según el número de particiones y la carga del sistema.</p>
      </div>
    </div>
  );
};

export default PerformanceMetrics; 
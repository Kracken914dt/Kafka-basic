import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceChart = ({ priceHistory }) => {
  const chartRef = useRef(null);

  // Configuración del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución del Precio de BTC/USDT',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    animation: {
      duration: 500,
    },
  };

  const data = {
    labels: priceHistory.map(item => item.time),
    datasets: [
      {
        label: 'Precio (USDT)',
        data: priceHistory.map(item => parseFloat(item.price)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.2,
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md h-[400px]">
      <Line ref={chartRef} options={options} data={data} />
    </div>
  );
};

export default PriceChart; 
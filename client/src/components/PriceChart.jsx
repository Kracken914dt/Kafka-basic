import { useRef } from 'react';
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
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Evolución del Precio de BTC/USDT',
        font: {
          size: 18,
          family: "'Inter', sans-serif",
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `Precio: ${context.parsed.y.toFixed(2)} USDT`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const data = {
    labels: priceHistory.map(item => item.time),
    datasets: [
      {
        label: 'Precio (USDT)',
        data: priceHistory.map(item => parseFloat(item.price)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
        fill: true
      },
    ],
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg h-[500px] transform hover:scale-[1.02] transition-transform duration-300">
      <Line ref={chartRef} options={options} data={data} />
    </div>
  );
};

export default PriceChart; 
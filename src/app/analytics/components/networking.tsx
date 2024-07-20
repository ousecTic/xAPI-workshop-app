import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { XAPIStatement } from '@/hooks/useXAPIData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: XAPIStatement[];
}

const chartOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Networking Methods',
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Connections'
      }
    }
  }
};

export default function NetworkingMethods({ data }: Props) {
  const connectionMethods = data.reduce((acc, statement) => {
    const method = JSON.parse(statement.result.response).method;
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const sortedMethods = Object.entries(connectionMethods)
    .sort(([, a], [, b]) => b - a);

  const chartData = {
    labels: sortedMethods.map(([method]) => method),
    datasets: [{
      label: 'Number of Connections',
      data: sortedMethods.map(([, count]) => count),
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }]
  };

  return (
    <div className="mb-8 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Networking Methods</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { XAPIStatement } from '@/hooks/useXAPIData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: XAPIStatement[];
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'xAPI Experience Levels',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Participants'
      }
    }
  }
};

export default function ExperienceLevel({ data }: Props) {
  const experienceLevels = data.reduce((acc, statement) => {
    const level = statement.result.response;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = {
    labels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    datasets: [{
      label: 'Number of Participants',
      data: [
        experienceLevels['Beginner'] || 0,
        experienceLevels['Intermediate'] || 0,
        experienceLevels['Advanced'] || 0,
        experienceLevels['Expert'] || 0
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <div className="mb-8 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">xAPI Experience Levels</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
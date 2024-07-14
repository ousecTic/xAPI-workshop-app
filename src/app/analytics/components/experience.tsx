import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface XAPIStatement {
  result: {
    response: string;
  };
}

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

export default function ExperienceLevelAnalytics({ data }: Props) {
    console.log(data)
  const experienceLevels = data.reduce((acc, statement) => {
    const level = statement.result.response;
    console.log(level)
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
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">xAPI Experience Levels</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
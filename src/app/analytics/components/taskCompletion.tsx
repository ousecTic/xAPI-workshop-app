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
      text: 'Task Completions',
    },
  },
};

export default function TaskCompletion({ data }: Props) {
  const taskCompletions = data.reduce((acc, statement) => {
    const taskName = statement.object.definition.name["en-US"];
    acc[taskName] = (acc[taskName] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = {
    labels: Object.keys(taskCompletions),
    datasets: [{
      label: 'Number of Completions',
      data: Object.values(taskCompletions),
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
    }]
  };

  return (
    <div className="mb-8 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Task Completions</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
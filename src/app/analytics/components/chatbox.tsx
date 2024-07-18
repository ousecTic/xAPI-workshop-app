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
      text: 'Most Active Chat Participants',
    },
  },
};

export default function Chatbox({ data }: Props) {
  const participantCounts = data.reduce((acc, statement) => {
    const name = statement.actor.name;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const sortedParticipants = Object.entries(participantCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const chartData = {
    labels: sortedParticipants.map(([name]) => name),
    datasets: [{
      label: 'Number of Messages',
      data: sortedParticipants.map(([, count]) => count),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <div className="mb-8 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Most Active Chat Participants</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
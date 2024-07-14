import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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
      text: 'Participant Emotions',
    },
  },
};

export default function EmojiAnalytics({ data }: Props) {
  const emotions = data.reduce((acc, statement) => {
    const emotion = statement.result.response;
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = {
    labels: Object.keys(emotions),
    datasets: [
      {
        data: Object.values(emotions),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Participant Emotions</h2>
      <Pie options={chartOptions} data={chartData} />
    </div>
  );
}
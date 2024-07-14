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
      text: 'Page Views',
    },
  },
};

export default function PageViewAnalytics({ data }: Props) {
  const pageCounts = data.reduce((acc, statement) => {
    const pageId = statement.object.id;
    const pageName = pageId.split('/').pop() || pageId;
    acc[pageName] = (acc[pageName] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const sortedPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const chartData = {
    labels: sortedPages.map(([page]) => page),
    datasets: [{
      label: 'Number of Views',
      data: sortedPages.map(([, count]) => count),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }]
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Most Viewed Pages</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { XAPIStatement } from '@/hooks/useXAPIData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: XAPIStatement[];
}

interface PauseSummary {
  second: number;
  count: number;
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Count'
      }
    }
  }
};

export default function VideoPauseAnalytics({ data }: Props) {
  // Process pause data
  const pauseData = data.reduce((acc, statement) => {
    try {
      const resultExtensions = (statement.result as any).extensions;
      if (resultExtensions && resultExtensions['http://example.com/xapi-workshop/pause-summary']) {
        const pauseSummary: PauseSummary[] = JSON.parse(resultExtensions['http://example.com/xapi-workshop/pause-summary']);
        pauseSummary.forEach(pause => {
          acc[pause.second] = (acc[pause.second] || 0) + pause.count;
        });
      }
    } catch (error) {
      console.error('Error parsing pause summary:', error);
    }
    return acc;
  }, {} as { [second: number]: number });

  // Prepare chart data for pauses
  const pauseChartData = {
    labels: Object.keys(pauseData).map(second => second === '0' ? 'No Pause' : `Second ${second}`),
    datasets: [{
      label: 'Pause Count',
      data: Object.values(pauseData),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <div className="mb-8 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Video Activity Analytics</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Most Paused Moments</h3>
        <Bar options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'Pause Distribution'}}}} data={pauseChartData} />
      </div>
    </div>
  );
}
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

export default function VideoActivityAnalytics({ data }: Props) {
  // Process response data
  const responseData = data.reduce((acc, statement) => {
    const response = statement.result.response;
    acc[response] = (acc[response] || 0) + 1;
    return acc;
  }, {} as { [response: string]: number });

  // Calculate total and correct responses
  const totalResponses = Object.values(responseData).reduce((sum, count) => sum + count, 0);
  const correctResponses = responseData['a'] || 0; // Assuming 'c' (7 points) is the correct answer
  const correctPercentage = totalResponses > 0 ? (correctResponses / totalResponses * 100).toFixed(2) : '0.00';

  // Prepare chart data for responses
  const responseChartData = {
    labels: ['6', '5', '7', '4'],
    datasets: [{
      label: 'Response Count',
      data: [
        responseData['a'] || 0,
        responseData['b'] || 0,
        responseData['c'] || 0,
        responseData['d'] || 0
      ],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }]
  };

  return (
    <div className="mb-8 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Video Activity Analytics</h2>
      <div className="mb-4">
        <Bar options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'User Responses'}}}} data={responseChartData} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Response Statistics</h3>
        <p className="text-lg">Total Responses: {totalResponses}</p>
        <p className="text-lg">Correct Percentage: {correctPercentage}%</p>
      </div>
    </div>
  );
}
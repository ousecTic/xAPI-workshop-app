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
      text: 'IEEE ICICLE Event Attendance',
    },
  },
};

export default function EventAttendanceAnalytics({ data }: Props) {
  const attendanceCounts = data.reduce((acc, statement) => {
    const count = statement.result.response;
    acc[count] = (acc[count] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = {
    labels: ['First Time', 'Second Time', 'Third Time', 'Fourth Time or More'],
    datasets: [{
      label: 'Number of Attendees',
      data: [
        attendanceCounts['1'] || 0,
        attendanceCounts['2'] || 0,
        attendanceCounts['3'] || 0,
        attendanceCounts['4+'] || 0
      ],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">IEEE ICICLE Event Attendance</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
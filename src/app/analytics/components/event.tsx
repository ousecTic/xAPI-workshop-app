'use client'

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getXAPIStatements } from '@/utils/xapiUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};

export function EventAttendanceAnalytics() {
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: number }>({});

  async function fetchData() {
    try {
      const statements = await getXAPIStatements({
        verb: "http://adlnet.gov/expapi/verbs/responded",
        activity: "http://example.com/xapi-workshop/icicle-events",
        related_activities: true,
      });

      const attendanceCounts = statements.reduce((acc, statement) => {
        const count = statement.result?.response;
        if (count) {
          acc[count] = (acc[count] || 0) + 1;
        }
        return acc;
      }, {} as { [key: string]: number });

      setAttendanceData(attendanceCounts);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const chartData = {
    labels: Object.keys(attendanceData).map(key => {
      switch(key) {
        case '1': return 'First Time';
        case '2': return 'Second Time';
        case '3': return 'Third Time';
        case '4-': return 'Fourth Time or More';
        default: return key;
      }
    }),
    datasets: [
      {
        label: 'Number of Participants',
        data: Object.values(attendanceData),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">IEEE ICICLE Event Attendance</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
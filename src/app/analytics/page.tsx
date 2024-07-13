'use client'

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getXAPIStatements } from '@/utils/xapiUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface XAPIStatement {
  actor: {
    name: string;
  };
  result: {
    response: string;
  };
  object: {
    id: string;
  };
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Quiz Results',
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

export default function QuizAnalytics() {
  const [experienceData, setExperienceData] = useState<{ [key: string]: number }>({});
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    try {
      const experienceStatements = await getXAPIStatements({
        verb: "http://adlnet.gov/expapi/verbs/responded",
        activity: "http://example.com/xapi-workshop/xapi-experience",
        related_activities: true,
      }) as XAPIStatement[];

      const experienceLevels = experienceStatements.reduce((acc, statement) => {
        const level = statement.result.response;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      setExperienceData(experienceLevels);

      const attendanceStatements = await getXAPIStatements({
        verb: "http://adlnet.gov/expapi/verbs/responded",
        activity: "http://example.com/xapi-workshop/icicle-events",
        related_activities: true,
      }) as XAPIStatement[];

      const attendanceCounts = attendanceStatements.reduce((acc, statement) => {
        const count = statement.result.response;
        acc[count] = (acc[count] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      setAttendanceData(attendanceCounts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 1000); // Fetch every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const experienceChartData = {
    labels: Object.keys(experienceData),
    datasets: [
      {
        label: 'Number of Participants',
        data: Object.values(experienceData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const attendanceChartData = {
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

  if (isLoading) {
    return <div className="text-center mt-8">Loading analytics...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6">Quiz Analytics</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">xAPI Experience Levels</h2>
        <Bar options={chartOptions} data={experienceChartData} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">IEEE ICICLE Event Attendance</h2>
        <Bar options={chartOptions} data={attendanceChartData} />
      </section>
    </div>
  );
}
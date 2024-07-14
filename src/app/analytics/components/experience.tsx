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
      text: 'xAPI Experience Levels',
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

export function ExperienceLevelAnalytics() {
  const [experienceData, setExperienceData] = useState<{ [key: string]: number }>({});

  async function fetchData() {
    try {
      const statements = await getXAPIStatements({
        verb: "http://adlnet.gov/expapi/verbs/responded",
        activity: "http://example.com/xapi-workshop/xapi-experience",
        related_activities: true,
      });

      const experienceLevels = statements.reduce((acc, statement) => {
        const level = statement.result?.response;
        if (level) {
          acc[level] = (acc[level] || 0) + 1;
        }
        return acc;
      }, {} as { [key: string]: number });

      setExperienceData(experienceLevels);
    } catch (error) {
      console.error('Error fetching experience data:', error);
    }
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Fetch every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const chartData = {
    labels: Object.keys(experienceData),
    datasets: [
      {
        label: 'Number of Participants',
        data: Object.values(experienceData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">xAPI Experience Levels</h2>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
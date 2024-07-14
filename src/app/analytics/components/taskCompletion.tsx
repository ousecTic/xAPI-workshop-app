'use client'

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import { getXAPIStatements } from '@/utils/xapiUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface XAPIStatement {
  actor: {
    name: string;
  };
  verb: {
    id: string;
  };
  object: {
    id: string;
    definition: {
      name: {
        "en-US": string;
      };
    };
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
      text: 'Task Analytics: Starts (Views) and Completions',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Events'
      },
      ticks: {
        stepSize: 1
      }
    }
  },
  animation: {
    duration: 500
  }
};

type TaskAnalyticsChartData = ChartData<'bar', number[], string>;

export function TaskAnalytics() {
  const [chartData, setChartData] = useState<TaskAnalyticsChartData>({
    labels: [],
    datasets: [
      {
        label: 'Starts (Views)',
        data: [],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Completions',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const viewStatements = await getXAPIStatements({
        verb: "http://id.tincanapi.com/verb/viewed",
        related_activities: true,
      }) as XAPIStatement[];

      const completedStatements = await getXAPIStatements({
        verb: "http://adlnet.gov/expapi/verbs/completed",
        related_activities: true,
      }) as XAPIStatement[];

      const taskData: { [key: string]: { starts: number, completions: number } } = {};

      viewStatements.forEach(statement => {
        const taskName = statement.object.definition.name["en-US"];
        if (!taskData[taskName]) taskData[taskName] = { starts: 0, completions: 0 };
        taskData[taskName].starts++;
      });

      completedStatements.forEach(statement => {
        const taskName = statement.object.definition.name["en-US"];
        if (!taskData[taskName]) taskData[taskName] = { starts: 0, completions: 0 };
        taskData[taskName].completions++;
      });

      const labels = Object.keys(taskData);
      const startData = labels.map(label => taskData[label].starts);
      const completionData = labels.map(label => taskData[label].completions);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Starts (Views)',
            data: startData,
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
          },
          {
            label: 'Completions',
            data: completionData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching task analytics data:', error);
      setError('Failed to fetch task analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Fetch every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <div className="mb-8">Loading task analytics...</div>;
  }

  if (error) {
    return <div className="mb-8 text-red-500">{error}</div>;
  }

  if (chartData.datasets[0].data.length === 0) {
    return <div className="mb-8">No task data available yet.</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Task Analytics: Starts (Views) and Completions</h2>
      <div className="w-full max-w-2xl mx-auto">
        <Bar options={chartOptions} data={chartData} />
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
        <pre className="whitespace-pre-wrap">{JSON.stringify(chartData, null, 2)}</pre>
      </div>
    </div>
  );
}
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
  result: {
    response: string;
  };
  context: {
    extensions: {
      "http://example.com/xapi/extension/connection-method": string;
    };
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
      text: 'Connection Methods',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  },
  animation: {
    duration: 500
  }
};

const methodColors = {
  'linkedin': 'rgba(0, 119, 181, 0.6)',
  'email': 'rgba(255, 69, 0, 0.6)',
  'phone': 'rgba(50, 205, 50, 0.6)',
  'other': 'rgba(128, 128, 128, 0.6)'
};

type ConnectionChartData = ChartData<'bar', number[], string>;

export function LinkedInConnectionAnalytics() {
  const [chartData, setChartData] = useState<ConnectionChartData>({
    labels: [],
    datasets: [{
      label: 'Number of Connections',
      data: [],
      backgroundColor: [],
    }]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const statements = await getXAPIStatements({
        verb: "http://adlnet.gov/expapi/verbs/connected",
        activity: "http://example.com/xapi-workshop/connection-activity",
        related_activities: true,
      }) as XAPIStatement[];

      const methodCounts = statements.reduce((acc, statement) => {
        if (statement.verb.id === "http://adlnet.gov/expapi/verbs/connected" &&
            statement.object.id === "http://example.com/xapi-workshop/connection-activity") {
          const method = statement.context.extensions["http://example.com/xapi/extension/connection-method"];
          acc[method] = (acc[method] || 0) + 1;
        }
        return acc;
      }, {} as { [key: string]: number });

      const labels = Object.keys(methodCounts);
      const data = Object.values(methodCounts);
      const backgroundColor = labels.map(
        method => methodColors[method as keyof typeof methodColors] || 'rgba(201, 203, 207, 0.6)'
      );

      setChartData({
        labels,
        datasets: [{
          label: 'Number of Connections',
          data,
          backgroundColor,
        }]
      });
    } catch (error) {
      console.error('Error fetching connection data:', error);
      setError('Failed to fetch connection data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <div className="mb-8">Loading connection analytics...</div>;
  }

  if (error) {
    return <div className="mb-8 text-red-500">{error}</div>;
  }

  if (chartData.datasets[0].data.length === 0) {
    return <div className="mb-8">No connection data available yet.</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Connection Methods</h2>
      <div className="w-full max-w-md mx-auto">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
}
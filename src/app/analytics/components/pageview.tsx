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
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Views'
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

type PageViewChartData = ChartData<'bar', number[], string>;

export function PageViewAnalytics() {
  const [chartData, setChartData] = useState<PageViewChartData>({
    labels: [],
    datasets: [{
      label: 'Number of Views',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const statements = await getXAPIStatements({
        verb: "http://id.tincanapi.com/verb/viewed",
        related_activities: true,
      }) as XAPIStatement[];

      const pageViewCounts = statements.reduce((acc, statement) => {
        if (statement.verb.id === "http://id.tincanapi.com/verb/viewed") {
          const pageName = statement.object.definition.name["en-US"];
          acc[pageName] = (acc[pageName] || 0) + 1;
        }
        return acc;
      }, {} as { [key: string]: number });

      // Sort pages by number of views and get top 10
      const sortedPages = Object.entries(pageViewCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      const labels = sortedPages.map(([name]) => name);
      const data = sortedPages.map(([, count]) => count);

      setChartData({
        labels,
        datasets: [{
          label: 'Number of Views',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        }]
      });
    } catch (error) {
      console.error('Error fetching page view data:', error);
      setError('Failed to fetch page view data. Please try again later.');
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
    return <div className="mb-8">Loading page view analytics...</div>;
  }

  if (error) {
    return <div className="mb-8 text-red-500">{error}</div>;
  }

  if (chartData.datasets[0].data.length === 0) {
    return <div className="mb-8">No page view data available yet.</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Most Viewed Pages</h2>
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
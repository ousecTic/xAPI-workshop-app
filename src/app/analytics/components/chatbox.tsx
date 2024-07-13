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
  object: {
    id: string;
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
      text: 'Top Chat Contributors',
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Comments'
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

type ChatChartData = ChartData<'bar', number[], string>;

export function ChatboxAnalytics() {
  const [chartData, setChartData] = useState<ChatChartData>({
    labels: [],
    datasets: [{
      label: 'Number of Comments',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const statements = await getXAPIStatements({
        verb: "http://adlnet.gov/expapi/verbs/commented",
        activity: "http://example.com/xapi-workshop/chatbox",
        related_activities: true,
      }) as XAPIStatement[];

      const commentCounts = statements.reduce((acc, statement) => {
        if (statement.verb.id === "http://adlnet.gov/expapi/verbs/commented" &&
            statement.object.id === "http://example.com/xapi-workshop/chatbox") {
          const name = statement.actor.name;
          acc[name] = (acc[name] || 0) + 1;
        }
        return acc;
      }, {} as { [key: string]: number });

      // Sort contributors by number of comments and get top 10
      const sortedContributors = Object.entries(commentCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      const labels = sortedContributors.map(([name]) => name);
      const data = sortedContributors.map(([, count]) => count);

      setChartData({
        labels,
        datasets: [{
          label: 'Number of Comments',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      });
    } catch (error) {
      console.error('Error fetching chatbox data:', error);
      setError('Failed to fetch chatbox data. Please try again later.');
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
    return <div className="mb-8">Loading chatbox analytics...</div>;
  }

  if (error) {
    return <div className="mb-8 text-red-500">{error}</div>;
  }

  if (chartData.datasets[0].data.length === 0) {
    return <div className="mb-8">No chatbox data available yet.</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Top Chat Contributors</h2>
      <div className="w-full max-w-2xl mx-auto">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
}
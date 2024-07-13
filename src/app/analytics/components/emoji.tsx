'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { getXAPIStatements } from '@/utils/xapiUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

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
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Participant Emotions',
    },
  },
  animation: {
    duration: 500 // Smooth transition for updates
  }
};

const emojiColors = {
  'Happy': 'rgba(255, 206, 86, 0.6)',
  'Neutral': 'rgba(75, 192, 192, 0.6)',
  'Sad': 'rgba(54, 162, 235, 0.6)',
  'Tired': 'rgba(153, 102, 255, 0.6)',
  'Curious': 'rgba(255, 159, 64, 0.6)',
  'Excited': 'rgba(255, 99, 132, 0.6)',
};

export function EmojiAnalytics() {
  const [chartData, setChartData] = useState<ChartData<'pie'>>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
    }]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const statements = await getXAPIStatements({
        verb: "http://adlnet.gov/expapi/verbs/responded",
        activity: "http://example.com/xapi-workshop/mood",
        related_activities: true,
      }) as XAPIStatement[];

      const emojiCounts = statements.reduce((acc, statement) => {
        if (statement.verb.id === "http://adlnet.gov/expapi/verbs/responded" &&
            statement.object.id === "http://example.com/xapi-workshop/mood" &&
            statement.result && statement.result.response) {
          const mood = statement.result.response;
          acc[mood] = (acc[mood] || 0) + 1;
        }
        return acc;
      }, {} as { [key: string]: number });

      const labels = Object.keys(emojiCounts);
      const data = Object.values(emojiCounts);
      const backgroundColor = labels.map(
        mood => emojiColors[mood as keyof typeof emojiColors] || 'rgba(201, 203, 207, 0.6)'
      );

      setChartData({
        labels,
        datasets: [{
          data,
          backgroundColor,
        }]
      });
    } catch (error) {
      console.error('Error fetching emoji data:', error);
      setError('Failed to fetch emoji data. Please try again later.');
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
    return <div className="mb-8">Loading emoji analytics...</div>;
  }

  if (error) {
    return <div className="mb-8 text-red-500">{error}</div>;
  }

  if (!chartData.labels || chartData.labels.length === 0) {
    return <div className="mb-8">No emoji data available yet.</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Participant Emotions</h2>
      <div className="w-full max-w-md mx-auto">
        <Pie options={chartOptions} data={chartData} />
      </div>
    </div>
  );
}

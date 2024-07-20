import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { XAPIStatement } from '@/hooks/useXAPIData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: XAPIStatement[];
}

type CountType = { [key: string]: number };

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'xAPI Terminology Quiz Responses',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Responses'
      }
    }
  }
};

const CORRECT_RESPONSE_KEY = "https://w3id.org/xapi/cmi5/result/extensions/correct-response";
const QUIZ_OPTIONS = ['Extended API', 'Experience API', 'External API', 'Exchange API'];

export default function Quiz({ data }: Props) {
  console.log(data)
  const { answerCounts, totalResponses, correctResponses } = useMemo(() => {
    const counts: CountType = QUIZ_OPTIONS.reduce((acc, option) => ({ ...acc, [option]: 0 }), {});
    let correct = 0;

    data.forEach(statement => {
      const answer = statement.result.response;
      if (answer in counts) {
        counts[answer]++;
      }

      const correctAnswer = statement.result.extensions?.[CORRECT_RESPONSE_KEY];
      if (answer === correctAnswer) {
        correct++;
      }
    });

    return { 
      answerCounts: counts, 
      totalResponses: data.length,
      correctResponses: correct
    };
  }, [data]);

  const chartData = {
    labels: QUIZ_OPTIONS,
    datasets: [{
      label: 'Number of Responses',
      data: QUIZ_OPTIONS.map(option => answerCounts[option]),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <div className="mb-8 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">xAPI Terminology Quiz Analysis</h2>
      <div className="mb-4">
        <Bar options={chartOptions} data={chartData} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">Response Statistics</h3>
        <p className="text-lg">Total Responses: {totalResponses}</p>
        <p className="text-lg">Correct Responses: {correctResponses} ({totalResponses > 0 ? ((correctResponses / totalResponses) * 100).toFixed(2) : 0}%)</p>
      </div>
    </div>
  );
}
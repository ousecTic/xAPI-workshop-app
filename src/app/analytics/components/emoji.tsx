import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { XAPIStatement } from '@/hooks/useXAPIData';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Props {
  beforeData: XAPIStatement[];
  afterData: XAPIStatement[];
}

interface EmotionSet {
  [key: string]: number;
}

const chartOptions = (title: string) => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: title,
    },
  },
});

// Fixed color mapping for emotions
const emotionColors : { [key: string]: string } = {
  'Happy': 'rgba(255, 206, 86, 0.6)',   // Yellow
  'Neutral': 'rgba(169, 169, 169, 0.6)', // Gray
  'Sad': 'rgba(54, 162, 235, 0.6)',     // Blue
  'Tired': 'rgba(75, 192, 192, 0.6)',   // Teal
  'Curious': 'rgba(153, 102, 255, 0.6)', // Purple
  'Excited': 'rgba(255, 99, 132, 0.6)',  // Pink
};

const processEmotions = (data: XAPIStatement[]) => {
  const emotions : EmotionSet = {};
  data.forEach(statement => {
    const emotion = statement.result.response;
    emotions[emotion] = (emotions[emotion] || 0) + 1;
  });
  return emotions;
};

const createChartData = (emotions: EmotionSet) => {
  const labels = Object.keys(emotions);
  const data = Object.values(emotions);
  const backgroundColor = labels.map(emotion => emotionColors[emotion] || 'rgba(200, 200, 200, 0.6)');

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
      },
    ],
  };
};

export default function EmojiComparison({ beforeData, afterData }: Props) {
  const beforeEmotions = processEmotions(beforeData);
  const afterEmotions = processEmotions(afterData);

  const beforeChartData = createChartData(beforeEmotions);
  const afterChartData = createChartData(afterEmotions);

  return (
    <div className="mb-8 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-center">Participant Emotions Comparison</h2>
      <div className="flex flex-wrap justify-center">
        <div className="w-full md:w-1/2 p-4">
          <Pie options={chartOptions('Before Activities')} data={beforeChartData} />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <Pie options={chartOptions('After Activities')} data={afterChartData} />
        </div>
      </div>
    </div>
  );
}
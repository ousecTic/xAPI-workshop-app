'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import { sendXAPIStatement } from '@/utils/xapiUtils';

const videoUrl = 'https://www.youtube-nocookie.com/embed/BB49x_uMlGA';

const options = [
  { value: 'a', label: '6' },
  { value: 'b', label: '5' },
  { value: 'c', label: '7' },
  { value: 'd', label: '4' },
];

// Function to summarize pause positions
const summarizePausePositions = (positions: number[]) => {
    const pauseCounts: { [second: number]: number } = {};
    positions.forEach(pos => {
      const second = Math.floor(pos);
      pauseCounts[second] = (pauseCounts[second] || 0) + 1;
    });
    
    // Convert to array, sort by count, and take top 3
    return Object.entries(pauseCounts)
      .map(([second, count]) => ({ second: Number(second), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

export default function VideoActivity() {
  const [hasWatched, setHasWatched] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [rewatchCount, setRewatchCount] = useState(0);
  const [pausePositions, setPausePositions] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    setIsClient(true);
    const storedName = localStorage.getItem('xapiUserName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleVideoStart = useCallback(() => {
    if (hasWatched) {
      setRewatchCount(prevCount => prevCount + 1);
    }
  }, [hasWatched]);

  const handleVideoEnd = useCallback(() => {
    if (!hasWatched) {
      setHasWatched(true);
      sendXAPIStatement({
        actor: {
          name: userName,
          mbox: `mailto:${userName}@example.com`
        },
        verb: {
          id: "http://adlnet.gov/expapi/verbs/completed",
          display: { "en-US": "completed" }
        },
        object: {
          id: "http://example.com/xapi-workshop/video-activity",
          definition: {
            name: { "en-US": "Dog Jump Video" },
            description: { "en-US": "A video showing a dog jumping before a ball is thrown" }
          }
        }
      });
    }
  }, [hasWatched, userName]);

  const handlePause = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      setPausePositions(prevPositions => {
        const newPositions = [...prevPositions, currentTime];
        console.log('Pause positions:', newPositions);
        return newPositions;
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      setError('Please select an answer before submitting.');
      return;
    }

    setError('');

    const pauseSummary = summarizePausePositions(pausePositions);
    console.log('Pause summary:', pauseSummary);

    const success = await sendXAPIStatement({
      actor: {
        name: userName,
        mbox: `mailto:${userName}@example.com`
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/answered",
        display: { "en-US": "answered" }
      },
      object: {
        id: "http://example.com/xapi-workshop/video-question",
        definition: {
          name: { "en-US": "Dog Jump Question" },
          description: { "en-US": "Question about the number of times the dog jumped in the video" }
        }
      },
      result: {
        response: selectedAnswer,
        success: selectedAnswer === 'a',
        completion: true,
        extensions: {
          "http://example.com/xapi-workshop/video-watched": hasWatched,
          "http://example.com/xapi-workshop/rewatch-count": rewatchCount,
          "http://example.com/xapi-workshop/pause-summary": JSON.stringify(pauseSummary),
        }
      }
    });

    if (success) {
      setIsSubmitted(true);
    } else {
      setError('Failed to submit your answer. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Video Activity</h2>
      
        <div className="mb-4 p-4 bg-gray-200 rounded-lg border border-gray-300">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Watch the video carefully.</li>
            <li>Select your answer from the options below.</li>
            <li>Click the &quot;Submit Answer&quot; button to check your response.</li>
        </ol>
        </div>

      <div className="player-wrapper mb-6" style={{ position: 'relative', paddingTop: '56.25%' }}>
        {isClient && (
          <ReactPlayer
            ref={playerRef}
            className="react-player"
            url={videoUrl}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            controls={true}
            onStart={handleVideoStart}
            onEnded={handleVideoEnd}
            onPause={handlePause}
            config={{
              playerVars: {
                rel: 0,
                modestbranding: 1
              }
            }}
          />
        )}
      </div>
      
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-300">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Question:</h3>
        <p className="mb-4 text-gray-700">How many times did the dog jump before the man threw the ball?</p>
        <div className="space-y-2">
          {options.map(option => (
            <label key={option.value} className="flex items-center space-x-2 text-gray-700">
              <input
                type="radio"
                value={option.value}
                checked={selectedAnswer === option.value}
                onChange={(e) => {
                  setSelectedAnswer(e.target.value);
                  setError('');
                }}
                className="form-radio"
                disabled={isSubmitted}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {error && <p className="text-red-500 mt-2 font-semibold">{error}</p>}
        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            Submit Answer
          </button>
        )}
        {isSubmitted && (
          <div className={`mt-4 p-4 rounded-lg ${selectedAnswer === 'a' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
            <h4 className="font-semibold mb-2 text-lg text-gray-800">
              {selectedAnswer === 'a' ? 'Correct!' : 'Incorrect'}
            </h4>
            <p className="text-gray-800 mb-2">
              {selectedAnswer === 'a' 
                ? 'The dog jumped 6 times before the man threw the ball.' 
                : 'The correct answer is 6. The dog jumped 6 times before the man threw the ball.'}
            </p>
            <p className="text-gray-800 font-semibold mt-4">
              Thank you for completing this activity! Please proceed to the next one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
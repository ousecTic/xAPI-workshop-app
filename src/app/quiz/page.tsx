'use client'

import React, { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import { sendXAPIStatement } from '@/utils/xapiUtils';
import { trackPageView, trackTaskCompleted } from '@/utils/pageViewTracker';

export default function Quiz() {
  const [userName, setUserName] = useState<string>('');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    trackPageView('quiz-activity');
    const storedName = localStorage.getItem('xapiUserName');
    if (storedName) {
      setUserName(storedName);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setIsModalOpen(false);
  };

  const sendXAPIStatements = async () => {
    const quizStatement = {
      actor: {
        name: userName,
        mbox: `mailto:${userName}@example.com`
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/answered",
        display: { "en-US": "answered" }
      },
      object: {
        id: "http://example.com/xapi-workshop/xapi-terminology-quiz",
        definition: {
          name: { "en-US": "xAPI Terminology Quiz" },
          description: { "en-US": "A quiz about what xAPI stands for" }
        }
      },
      result: {
        response: selectedAnswer,
        extensions: {
          "https://w3id.org/xapi/cmi5/result/extensions/correct-response": "Experience API"
        }
      }
    };

    const quizSuccess = await sendXAPIStatement(quizStatement);

    trackTaskCompleted('quiz-activity');
    return quizSuccess;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAnswer) {
      setError('Please select an answer');
      return;
    }

    const success = await sendXAPIStatements();
    if (success) {
      setSubmitted(true);
      setError('');
    } else {
      setError('Failed to submit your response. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you for your response!</h2>
        <p className="text-lg mb-4">The correct answer is: Experience API.</p>
        <p className="text-lg mb-4">xAPI stands for Experience API, which reflects its purpose of tracking and analyzing various learning experiences.</p>
        <p className="text-lg">You're ready to move to the next activity.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800">
      <Modal isOpen={isModalOpen} onNameSubmit={handleNameSubmit} />
      <h2 className="text-2xl font-bold mb-6">xAPI Terminology Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <p className="text-lg font-medium text-gray-700 mb-4">
            What does xAPI stand for?
          </p>
          {['Extended API', 'Experience API', 'External API', 'Exchange API'].map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="radio"
                id={`option-${index}`}
                name="quiz-answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="mr-2"
              />
              <label htmlFor={`option-${index}`} className="text-lg">{option}</label>
            </div>
          ))}
        </div>
        <button 
          type="submit" 
          className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
      {error && <p className="mt-4 text-red-600 text-lg">{error}</p>}
    </div>
  );
}
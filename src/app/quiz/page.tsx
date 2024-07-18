'use client'

import React, { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import { sendXAPIStatement } from '@/utils/xapiUtils';
import { trackPageView, trackTaskCompleted } from '@/utils/pageViewTracker';

export default function Quiz() {
  const [userName, setUserName] = useState<string>('');
  const [experience, setExperience] = useState("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    trackPageView('quiz-activity');
    const storedName = localStorage.getItem('xapiUserName');
    if (storedName) {
      setUserName(storedName);
    }else {
      setIsModalOpen(true);
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setIsModalOpen(false);
  };

  const sendXAPIStatements = async () => {
    const experienceStatement = {
      actor: {
        name: userName,
        mbox: `mailto:${userName}@example.com`
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/responded",
        display: { "en-US": "responded" }
      },
      object: {
        id: "http://example.com/xapi-workshop/xapi-experience",
        definition: {
          name: { "en-US": "xAPI Experience Level" },
          description: { "en-US": "The participant's self-reported experience level with xAPI" }
        }
      },
      result: {
        response: experience
      }
    };

    const experienceSuccess = await sendXAPIStatement(experienceStatement);

    trackTaskCompleted('quiz-activity');
    return experienceSuccess;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!experience) {
      setError('Please answer the question');
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
        <p className="text-lg mb-4">You&apos;re ready to move to the next activity.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800">
      <Modal isOpen={isModalOpen} onNameSubmit={handleNameSubmit} />
      <h2 className="text-2xl font-bold mb-6">xAPI Workshop Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="experience" className="block text-lg font-medium text-gray-700 mb-2">
            What is your experience with xAPI?
          </label>
          <select
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full p-3 border rounded-md text-lg"
          >
            <option value="">Select your experience level</option>
            <option value="Beginner">Beginner - I&apos;m just starting to learn about xAPI</option>
            <option value="Intermediate">Intermediate - I have some experience with xAPI</option>
            <option value="Advanced">Advanced - I&apos;m very familiar with xAPI</option>
            <option value="Expert">Expert - I work with xAPI regularly</option>
          </select>
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
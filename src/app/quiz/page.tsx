'use client'

import React, { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import { sendXAPIStatement } from '@/utils/xapiUtils';

export default function Quiz() {
  const [userName, setUserName] = useState<string>('');
  const [answers, setAnswers] = useState({
    experience: '',
    icicleEvents: ''
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedName = localStorage.getItem('xapiUserName');
    if (storedName) {
      setUserName(storedName);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleSubmitName = () => {
    if (userName.trim()) {
      localStorage.setItem('xapiUserName', userName);
      setIsModalOpen(false);
    } else {
      setError('Please enter your name');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!answers.experience || !answers.icicleEvents) {
      setError('Please answer both questions');
      return;
    }

    const statement = {
      actor: {
        name: userName,
        mbox: `mailto:example@example.com`
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/answered",
        display: { "en-US": "answered" }
      },
      object: {
        id: "http://example.com/xapi-workshop/quiz",
        definition: {
          name: { "en-US": "xAPI Workshop Quiz" },
          description: { "en-US": "A quiz about xAPI experience and ICICLE event attendance" }
        }
      },
      result: {
        response: JSON.stringify(answers)
      },
      context: {
        extensions: {
          "http://example.com/xapi/extension/workshop-id": "xapi-workshop-2023"
        }
      }
    };

    const success = await sendXAPIStatement(statement);
    if (success) {
      setSubmitted(true);
      setError('');
    } else {
      setError('Failed to submit your responses. Please try again.');
    }
  };

  if (submitted) {
    return <div className="text-green-600 text-center mt-4 p-4">Thank you for submitting your responses!</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-4 p-4 bg-white rounded-lg shadow-xl text-gray-800">
      <h2 className="text-xl font-bold mb-4">xAPI Workshop Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">What is your experience with xAPI?</label>
          <select
            id="experience"
            value={answers.experience}
            onChange={(e) => setAnswers({...answers, experience: e.target.value})}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">Select your experience level</option>
            <option value="Beginner">Beginner - I&apos;m just starting to learn about xAPI</option>
            <option value="Intermediate">Intermediate - I have some experience with xAPI</option>
            <option value="Advanced">Advanced - I&apos;m very familiar with xAPI</option>
            <option value="Expert">Expert - I work with xAPI regularly</option>
          </select>
        </div>
        <div>
          <label htmlFor="icicleEvents" className="block text-sm font-medium text-gray-700 mb-1">How many times have you attended an ICICLE event?</label>
          <select
            id="icicleEvents"
            value={answers.icicleEvents}
            onChange={(e) => setAnswers({...answers, icicleEvents: e.target.value})}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">Select the number of events</option>
            <option value="0">This is my first time</option>
            <option value="1-2">1-2 times</option>
            <option value="3-5">3-5 times</option>
            <option value="6+">6 or more times</option>
          </select>
        </div>
        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Submit
        </button>
      </form>
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Enter Your Name</h2>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
          placeholder="Your name"
        />
        <button 
          onClick={handleSubmitName} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm w-full"
        >
          Submit
        </button>
      </Modal>
    </div>
  );
}
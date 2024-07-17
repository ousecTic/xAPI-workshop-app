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
    console.log("render")
  }, []);

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
    return experienceSuccess 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!experience) {
      setError('Please answer question');
      return;
    }

    const success = await sendXAPIStatements();
    if (success) {
      setSubmitted(true);
      setError('');
    } else {
      setError('Failed to submit your responses. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you for your responses!</h2>
        <p className="text-lg mb-4">You&apos;re ready to move to the next activity.</p>
        {/* Add a button or link to the next activity here if needed */}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Enter Your Name</h2>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-3 border rounded-md text-lg"
          placeholder="Your name"
        />
        <button 
          onClick={handleSubmitName} 
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-lg w-full"
        >
          Submit
        </button>
      </Modal>
    </div>
  );
}
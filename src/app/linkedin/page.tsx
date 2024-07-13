'use client'

import React, { useState, useEffect } from 'react';
import { sendXAPIStatement } from '@/utils/xapiUtils';
import Modal from '@/app/components/Modal';

export default function LinkedInConnection() {
  const [userName, setUserName] = useState<string>('');
  const [connectedPerson, setConnectedPerson] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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
    if (!connectedPerson.trim()) {
      setError('Please enter the name of the person you connected with');
      return;
    }

    const statement = {
      actor: {
        name: userName,
        mbox: `mailto:${userName}@example.com`
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/connected",
        display: { "en-US": "connected with" }
      },
      object: {
        id: "http://example.com/xapi-workshop/linkedin-connection",
        definition: {
          name: { "en-US": "LinkedIn Connection" },
          description: { "en-US": "Connected with another participant during the workshop" }
        }
      },
      result: {
        response: connectedPerson
      }
    };

    const success = await sendXAPIStatement(statement);
    if (success) {
      setIsSubmitted(true);
      setError('');
    } else {
      setError('Failed to submit your connection. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you for connecting!</h2>
        <p className="text-lg mb-4">Your new connection has been recorded. You&apos;re ready to move to the next activity.</p>
        {/* Add a button or link to the next activity here if needed */}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800">
      <h2 className="text-2xl font-bold mb-6">LinkedIn Connection Activity</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Find someone in the room you haven&apos;t connected with before.</li>
          <li>Connect with them on LinkedIn, or exchange email/phone number.</li>
          <li>Once connected, enter their first name below and submit.</li>
        </ol>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="connectedPerson" className="block text-lg font-medium text-gray-700 mb-2">
            Who did you connect with?
          </label>
          <input
            type="text"
            id="connectedPerson"
            value={connectedPerson}
            onChange={(e) => setConnectedPerson(e.target.value)}
            className="w-full p-3 border rounded-md text-lg"
            placeholder="Enter their first name"
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Connection
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
'use client'

import React, { useState, useEffect } from 'react';
import { sendXAPIStatement } from '@/utils/xapiUtils';
import Modal from '@/app/components/Modal';
import { trackPageView, trackTaskCompleted } from '@/utils/pageViewTracker';

const connectionMethods = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'other', label: 'Other' }
];

export default function ConnectionActivity() {
  const [userName, setUserName] = useState<string>('');
  const [connectedPerson, setConnectedPerson] = useState<string>('');
  const [connectionMethod, setConnectionMethod] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    trackPageView('Workshop Connection Activity');
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!connectedPerson.trim() || !connectionMethod) {
      setError('Please enter the name of the person you connected with and select a connection method');
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
        id: "http://example.com/xapi-workshop/connection-activity",
        definition: {
          name: { "en-US": "Workshop Connection Activity" },
          description: { "en-US": "Connected with another participant during the workshop" }
        }
      },
      result: {
        response: JSON.stringify({ person: connectedPerson, method: connectionMethod })
      },
      context: {
        extensions: {
          "http://example.com/xapi/extension/connection-method": connectionMethod
        }
      }
    };

    const success = await sendXAPIStatement(statement);



    if (success) {
      setIsSubmitted(true);
      setError('');
    } else {
      setError('Failed to submit your connection. Please try again.');
    }

    trackTaskCompleted('Workshop Connection Activity');
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
      <Modal isOpen={isModalOpen} onNameSubmit={handleNameSubmit} />
      <h2 className="text-2xl font-bold mb-6">Workshop Connection Activity</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Find someone in the room you haven&apos;t connected with before.</li>
          <li>Connect with them via LinkedIn, email, phone, or another method.</li>
          <li>Once connected, enter their name and how you connected below.</li>
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
            placeholder="Enter their name"
          />
        </div>
        <div>
          <label htmlFor="connectionMethod" className="block text-lg font-medium text-gray-700 mb-2">
            How did you connect?
          </label>
          <select
            id="connectionMethod"
            value={connectionMethod}
            onChange={(e) => setConnectionMethod(e.target.value)}
            className="w-full p-3 border rounded-md text-lg"
          >
            <option value="">Select connection method</option>
            {connectionMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Connection
        </button>
      </form>
      {error && <p className="mt-4 text-red-600 text-lg">{error}</p>}
    </div>
  );
}
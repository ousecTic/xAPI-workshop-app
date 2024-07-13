'use client'

import React, { useState, useEffect } from 'react';
import { sendXAPIStatement } from '@/utils/xapiUtils';
import Modal from '@/app/components/Modal';

const emojis = [
  { emoji: '😊', mood: 'Happy' },
  { emoji: '😐', mood: 'Neutral' },
  { emoji: '😔', mood: 'Sad' },
  { emoji: '😴', mood: 'Tired' },
  { emoji: '🤔', mood: 'Curious' },
  { emoji: '🤩', mood: 'Excited' }
];

export default function EmojiActivity() {
  const [userName, setUserName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  const handleEmojiClick = async (mood: string) => {
    if (!userName) {
      setError('Please enter your name first.');
      setIsModalOpen(true);
      return;
    }

    const statement = {
      actor: {
        name: userName,
        mbox: `mailto:${userName}@example.com`
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/responded",
        display: { "en-US": "responded" }
      },
      object: {
        id: "http://example.com/xapi-workshop/mood",
        definition: {
          name: { "en-US": "Current Mood" },
          description: { "en-US": "The participant&apos;s current mood represented by an emoji" }
        }
      },
      result: {
        response: mood
      }
    };

    const success = await sendXAPIStatement(statement);
    if (success) {
      setIsSubmitted(true);
    } else {
      setError('Failed to submit your response. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you for your response!</h2>
        <p className="text-lg mb-4">You&apos;re ready to move to the next activity.</p>
        {/* Add a button or link to the next activity here if needed */}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center">How are you feeling today?</h2>
      <p className="text-center text-lg mb-4">Click on an emoji to select your current mood</p>
      <div className="grid grid-cols-3 gap-4">
        {emojis.map(({ emoji, mood }) => (
          <button
            key={mood}
            onClick={() => handleEmojiClick(mood)}
            className="text-6xl p-4 rounded-full transition-transform duration-200 ease-in-out transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={mood}
          >
            {emoji}
          </button>
        ))}
      </div>
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

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
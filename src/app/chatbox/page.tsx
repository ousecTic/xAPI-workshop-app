'use client'

import React, { useState, useEffect, useRef } from 'react';
import { sendXAPIStatement, getXAPIStatements } from '@/utils/xapiUtils';
import Modal from '@/app/components/Modal';
import { trackPageView, trackTaskCompleted } from '@/utils/pageViewTracker';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export default function Chatbox() {
  const [userName, setUserName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackPageView('chatbox-activity');
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('xapiUserName');
    if (storedName) {
      setUserName(storedName);
    } else {
      setIsModalOpen(true);
    }

    const pollInterval = setInterval(pollMessages, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmitName = () => {
    if (userName.trim()) {
      localStorage.setItem('xapiUserName', userName);
      setIsModalOpen(false);
    } else {
      setError('Please enter your name');
    }
  };

  const pollMessages = async () => {
    try {
      const statements = await getXAPIStatements({
        verb: "http://adlnet.gov/expapi/verbs/commented",
        activity: "http://example.com/xapi-workshop/chatbox",
        related_activities: true,
        limit: 100,
        ascending: true
      });

      const newMessages = statements.map((statement: any) => ({
        id: statement.id,
        sender: statement.actor.name,
        content: statement.result.response,
        timestamp: new Date(statement.timestamp).toLocaleTimeString(),
      }));

      setMessages(newMessages);
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const statement = {
      actor: {
        name: userName,
        mbox: `mailto:${userName}@example.com`
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/commented",
        display: { "en-US": "commented" }
      },
      object: {
        id: "http://example.com/xapi-workshop/chatbox",
        definition: {
          name: { "en-US": "Workshop Chatbox" },
          description: { "en-US": "A chatbox for workshop participants" }
        }
      },
      result: {
        response: inputMessage
      }
    };

    const success = await sendXAPIStatement(statement);
    if (success) {
      setInputMessage('');
      setHasSubmitted(true);
      pollMessages(); // Immediately poll for new messages
    } else {
      setError('Failed to send message. Please try again.');
    }

    trackTaskCompleted('chatbox-activity');
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800">
      <h2 className="text-2xl font-bold mb-6">Workshop Chatbox</h2>
      <div 
        ref={chatBoxRef}
        className="border rounded-md p-4 h-80 overflow-y-auto mb-4"
      >
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="font-bold">{message.sender}: </span>
            <span>{message.content}</span>
            <span className="text-xs text-gray-500 ml-2">{message.timestamp}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow p-2 border rounded-l-md"
          placeholder="Type your message..."
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
        >
          Send
        </button>
      </form>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {hasSubmitted && (
        <p className="mt-2 text-green-600">
          Thank you for your contribution! You may continue to chat or proceed to the next activity.
        </p>
      )}

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
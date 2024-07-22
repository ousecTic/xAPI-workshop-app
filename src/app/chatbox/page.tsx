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
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackPageView('chatbox-activity');
    const storedName = localStorage.getItem('xapiUserName');
    if (storedName) {
      setUserName(storedName);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (userName) {
      const pollInterval = setInterval(pollMessages, 5000); // Poll every 5 seconds
      return () => clearInterval(pollInterval);
    }
  }, [userName]);

  useEffect(() => {
    if (isAtBottom && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  const handleScroll = () => {
    if (chatBoxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setIsModalOpen(false);
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
      setIsAtBottom(true);
      pollMessages(); // Immediately poll for new messages
    } else {
      setError('Failed to send message. Please try again.');
    }

    trackTaskCompleted('chatbox-activity');
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl text-gray-800">
      <Modal isOpen={isModalOpen} onNameSubmit={handleNameSubmit} /> 
      <h2 className="text-2xl font-bold mb-6">Workshop Chatbox</h2>

      <div className="mb-4 p-4 border rounded-md bg-blue-50">
        <p className="font-bold text-lg">Chatbox Activity Rules:</p>
        <div className="text-gray-700 mt-2">
          <p className="mb-2">1. Share your name, role, and what sparked your interest in xAPI!</p>
          <p className="mb-2">2. (Optional) Comment on someone else&apos;s message! Do you share their curiosity? Have you had similar experiences?</p>
        </div>
      </div>

      <div 
        ref={chatBoxRef}
        className="border rounded-md p-4 h-80 overflow-y-auto mb-4"
        onScroll={handleScroll}
      >
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className="mb-2"
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
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
    </div>
  );
}
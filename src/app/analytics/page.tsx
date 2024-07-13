'use client'

import React from 'react';
import { ExperienceLevelAnalytics } from './components/experience';
import { EventAttendanceAnalytics } from './components/event';
import { EmojiAnalytics } from './components/emoji';
import { LinkedInConnectionAnalytics } from './components/linkedin';
import { ChatboxAnalytics } from './components/chatbox';

export default function Analytics() {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6">Workshop Analytics</h1>
      
      <ExperienceLevelAnalytics />
      <EventAttendanceAnalytics />
      <EmojiAnalytics />
      <LinkedInConnectionAnalytics />
      <ChatboxAnalytics />

      {/* You can add more analytics components here as needed */}
    </div>
  );
}
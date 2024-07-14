'use client'

import React from 'react';
import { useXAPIData } from '@/hooks/useXAPIData';
import ExperienceLevelAnalytics from './components/experience';
import EventAttendanceAnalytics from './components/event';
import EmojiAnalytics from './components/emoji';
import LinkedInConnectionAnalytics from './components/linkedin';
import ChatboxAnalytics from './components/chatbox';
import PageViewAnalytics from "./components/pageview"
import TaskAnalytics from "./components/taskCompletion"

export default function Analytics() {
  const { error, filterStatements } = useXAPIData();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6">Workshop Analytics</h1>
      
      <ExperienceLevelAnalytics data={filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/xapi-experience")} />
      <EventAttendanceAnalytics data={filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/icicle-events")} />
      <EmojiAnalytics data={filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/mood")} />
      <LinkedInConnectionAnalytics data={filterStatements("http://adlnet.gov/expapi/verbs/connected", "http://example.com/xapi-workshop/connection-activity")} />
      <ChatboxAnalytics data={filterStatements("http://adlnet.gov/expapi/verbs/commented", "http://example.com/xapi-workshop/chatbox")} />
      <PageViewAnalytics data={filterStatements("http://id.tincanapi.com/verb/viewed")} />
      <TaskAnalytics data={filterStatements("http://adlnet.gov/expapi/verbs/completed")} />
    </div>
  );
}
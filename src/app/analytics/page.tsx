'use client'

import React from 'react';
import { useXAPIData } from '@/hooks/useXAPIData';
import ExperienceLevel from './components/experience';
import EmojiComparison from './components/emoji';
import LinkedInConnection from './components/linkedin';
import Chatbox from './components/chatbox';
import PageView from "./components/pageview"
import Task from "./components/taskCompletion"

export default function WorkshopDashboard() {
  const { error, filterStatements } = useXAPIData();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const beforeEmojiData = filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/mood/before");
  const afterEmojiData = filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/mood/after");

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6">Workshop Dashboard</h1>
      <ExperienceLevel data={filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/xapi-experience")} />
      <EmojiComparison beforeData={beforeEmojiData} afterData={afterEmojiData} />
      <LinkedInConnection data={filterStatements("http://adlnet.gov/expapi/verbs/connected", "http://example.com/xapi-workshop/connection-activity")} />
      <Chatbox data={filterStatements("http://adlnet.gov/expapi/verbs/commented", "http://example.com/xapi-workshop/chatbox")} />
      <PageView data={filterStatements("http://id.tincanapi.com/verb/viewed")} />
      <Task data={filterStatements("http://adlnet.gov/expapi/verbs/completed")} />
    </div>
  );
}
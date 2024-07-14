'use client'

import React from 'react';
import { useXAPIData } from '@/hooks/useXAPIData';
import ExperienceLevel from './components/experience';
import EventAttendance from './components/event';
import Emoji from './components/emoji';
import LinkedInConnection from './components/linkedin';
import Chatbox from './components/chatbox';
import PageView from "./components/pageview"
import Task from "./components/taskCompletion"

export default function WorkshopDashboard() {
  const { error, filterStatements } = useXAPIData();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6">Workshop </h1>
      <ExperienceLevel data={filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/xapi-experience")} />
      <EventAttendance data={filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/icicle-events")} />
      <Emoji data={filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/mood")} />
      <LinkedInConnection data={filterStatements("http://adlnet.gov/expapi/verbs/connected", "http://example.com/xapi-workshop/connection-activity")} />
      <Chatbox data={filterStatements("http://adlnet.gov/expapi/verbs/commented", "http://example.com/xapi-workshop/chatbox")} />
      <PageView data={filterStatements("http://id.tincanapi.com/verb/viewed")} />
      <Task data={filterStatements("http://adlnet.gov/expapi/verbs/completed")} />
    </div>
  );
}
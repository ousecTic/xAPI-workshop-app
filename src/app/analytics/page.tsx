'use client'

import React from 'react';
import { useXAPIData } from '@/hooks/useXAPIData';
import Quiz from './components/quiz';
import EmojiComparison from './components/emoji';
import NetworkingMethods from './components/networking';
import Chatbox from './components/chatbox';
import PageView from "./components/pageview"
import Task from "./components/taskCompletion"
import VideoActivityAnalytics from './components/video';
import VideoPauseAnalytics from './components/videoPause';

export default function WorkshopDashboard() {
  const { error, filterStatements } = useXAPIData();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const beforeEmojiData = filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/mood/before");
  const afterEmojiData = filterStatements("http://adlnet.gov/expapi/verbs/responded", "http://example.com/xapi-workshop/mood/after");
  const videoActivityData = filterStatements("http://adlnet.gov/expapi/verbs/answered", "http://example.com/xapi-workshop/video-question");
  const quizData = filterStatements("http://adlnet.gov/expapi/verbs/answered", "http://example.com/xapi-workshop/xapi-terminology-quiz");
  const chatboxData = filterStatements("http://adlnet.gov/expapi/verbs/commented", "http://example.com/xapi-workshop/chatbox");
  const networkingMethodsData = filterStatements("http://adlnet.gov/expapi/verbs/connected", "http://example.com/xapi-workshop/connection-activity");
  const pageViewData = filterStatements("http://id.tincanapi.com/verb/viewed");
  const taskCompletionData = filterStatements("http://adlnet.gov/expapi/verbs/completed");

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold">Workshop Dashboard</h1>
      
      {/* Main activities above the fold */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="col-span-1">
          <Quiz data={quizData} />
        </div>
        <div className="col-span-1">
          <VideoActivityAnalytics data={videoActivityData} />
        </div>
        <div className="col-span-1">
          <Chatbox data={chatboxData} />
        </div>
        <div className="col-span-1">
          <NetworkingMethods data={networkingMethodsData} />
        </div>
      </div>
      
      {/* Divider */}
      <hr className="my-8 border-gray-300" />
      
      {/* Additional analytics below the fold */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Additional Insights</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <VideoPauseAnalytics data={videoActivityData} />
          </div>
          <div className="col-span-2">
            <EmojiComparison beforeData={beforeEmojiData} afterData={afterEmojiData} />
          </div>
          <div className="col-span-1">
            <PageView data={pageViewData} />
          </div>
          <div className="col-span-1">
            <Task data={taskCompletionData} />
          </div>
        </div>
      </div>
    </div>
  );
}
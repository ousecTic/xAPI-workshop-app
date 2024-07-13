// utils/pageViewTracker.ts

import { sendXAPIStatement } from './xapiUtils';

export function trackPageView(pageName: string) {
  const statement = {
    actor: {
      name: localStorage.getItem('xapiUserName') || 'Anonymous User',
      mbox: `mailto:${localStorage.getItem('xapiUserName')}@example.com`
    },
    verb: {
      id: "http://id.tincanapi.com/verb/viewed",
      display: { "en-US": "viewed" }
    },
    object: {
      id: `http://example.com/xapi-workshop/pages/${pageName}`,
      definition: {
        name: { "en-US": pageName },
        description: { "en-US": `The ${pageName} page of the xAPI workshop` }
      }
    }
  };

  sendXAPIStatement(statement);
}
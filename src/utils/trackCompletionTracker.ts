import { sendXAPIStatement } from "./xapiUtils";

export function trackTaskCompleted(taskName: string) {
    const statement = {
      actor: {
        name: localStorage.getItem('xapiUserName') || 'Anonymous User',
        mbox: `mailto:${localStorage.getItem('xapiUserName')}@example.com`
      },
      verb: {
        id: "http://adlnet.gov/expapi/verbs/completed",
        display: { "en-US": "completed" }
      },
      object: {
        id: `http://example.com/xapi-workshop/tasks/${taskName}`,
        definition: {
          name: { "en-US": taskName },
          description: { "en-US": `The ${taskName} task of the xAPI workshop` }
        }
      },
      result: {
        completion: true,
        success: true
      }
    };
  
    sendXAPIStatement(statement);
  }

  const viewCounts: { [key: string]: number } = {};

  export function trackPageView(pageName: string) {
    console.log(`trackPageView called for ${pageName}`);
  
    // Increment view count
    viewCounts[pageName] = (viewCounts[pageName] || 0) + 1;
    
    console.log(`View count for ${pageName}: ${viewCounts[pageName]}`);
  
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
import XAPI, {GetStatementsParamsWithoutAttachments} from '@xapi/xapi';

const XAPI_CONFIG = {
  endpoint: process.env.XAPI_ENDPOINT as string,
  username: process.env.XAPI_USERNAME as string,
  password: process.env.XAPI_PASSWORD as string
};

const xapiInstance = new XAPI({
  endpoint: XAPI_CONFIG.endpoint,
  auth: "Basic " + btoa(`${XAPI_CONFIG.username}:${XAPI_CONFIG.password}`)
});

export const sendXAPIStatement = async (statement: any) => {
  try {
    await xapiInstance.sendStatement({ statement });
    return true;
  } catch (error) {
    console.error("Error sending xAPI statement:", error);
    return false;
  }
};

export const getXAPIStatements = async (query : GetStatementsParamsWithoutAttachments) => {
  try {
    const result = await xapiInstance.getStatements(query);
    return result.data.statements;
  } catch (error) {
    console.error("Error fetching xAPI statements:", error);
    throw error;
  }
};
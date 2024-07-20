import { useState, useEffect, useCallback } from 'react';
import { getXAPIStatements } from '../utils/xapiUtils';

export interface XAPIStatement {
  actor: {
    name: string;
  };
  verb: {
    id: string;
  };
  object: {
    id: string;
    definition: {
      name: {
        "en-US": string;
      };
    };
  };
  result: {
    response: string;
    extensions?: {
      [key: string]: string;
    }
  };
}

export function useXAPIData() {
  const [data, setData] = useState<XAPIStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const allStatements = await getXAPIStatements({
        related_activities: true,
        limit: 1000,  // Adjust this number based on your needs
      }) as XAPIStatement[];
      setData(allStatements);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching xAPI data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Fetch every 60 seconds
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const filterStatements = useCallback((verb: string, activity?: string) => {
    return data.filter(statement => 
      statement.verb.id === verb && 
      (!activity || statement.object.id === activity)
    );
  }, [data]);

  return { data, isLoading, error, fetchData, filterStatements };
}
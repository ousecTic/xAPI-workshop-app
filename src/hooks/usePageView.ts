import { useEffect, useRef } from 'react';
import { trackPageView } from '../utils/pageViewTracker';

export function usePageView(pageName: string) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      trackPageView(pageName);
      isFirstRender.current = false;
    }
  }, [pageName]);
}
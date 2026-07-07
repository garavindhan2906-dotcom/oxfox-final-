'use client';

import { useEffect } from 'react';
import { trackVisit, type PageType } from '@/lib/visitTracker';

export default function VisitBeacon({ pageType }: { pageType: PageType }) {
  useEffect(() => {
    trackVisit(pageType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

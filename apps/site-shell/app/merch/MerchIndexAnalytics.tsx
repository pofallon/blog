'use client';

import { useEffect } from 'react';
import { trackMerchIndexView } from '@/lib/merch/analytics';

interface MerchIndexAnalyticsProps {
  productCount: number;
}

export default function MerchIndexAnalytics({ productCount }: MerchIndexAnalyticsProps) {
  useEffect(() => {
    trackMerchIndexView(productCount);
  }, [productCount]);

  return null;
}

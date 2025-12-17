'use client';

import { useEffect } from 'react';
import { trackMerchProductView } from '@/lib/merch/analytics';
import type { ProductStatus } from '@/lib/merch/types';

interface MerchProductAnalyticsProps {
  productSlug: string;
  productName: string;
  productStatus: ProductStatus;
}

export default function MerchProductAnalytics({
  productSlug,
  productName,
  productStatus,
}: MerchProductAnalyticsProps) {
  useEffect(() => {
    trackMerchProductView(productSlug, productName, productStatus);
  }, [productSlug, productName, productStatus]);

  return null;
}

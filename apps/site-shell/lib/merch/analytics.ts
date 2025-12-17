import type { ProductStatus } from './types';

interface MerchIndexViewEvent {
  event: 'merch_index_view';
  productCount: number;
  timestamp: string;
}

interface MerchProductViewEvent {
  event: 'merch_product_view';
  productSlug: string;
  productName: string;
  productStatus: ProductStatus;
  timestamp: string;
}

type MerchAnalyticsEvent = MerchIndexViewEvent | MerchProductViewEvent;

function logEvent(event: MerchAnalyticsEvent): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event);
  }

  // Future: integrate with analytics service
  // analytics.track(event.event, event);
}

export function trackMerchIndexView(productCount: number): void {
  logEvent({
    event: 'merch_index_view',
    productCount,
    timestamp: new Date().toISOString(),
  });
}

export function trackMerchProductView(
  productSlug: string,
  productName: string,
  productStatus: ProductStatus
): void {
  logEvent({
    event: 'merch_product_view',
    productSlug,
    productName,
    productStatus,
    timestamp: new Date().toISOString(),
  });
}

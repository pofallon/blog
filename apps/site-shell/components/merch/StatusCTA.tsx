import Link from 'next/link';
import type { ProductStatus } from '@/lib/merch/types';

interface StatusCTAProps {
  status: ProductStatus;
  productSlug: string;
  variant?: 'index' | 'detail';
  contactHref?: string;
}

const CTA_CONFIG: Record<
  ProductStatus,
  {
    indexLabel: string;
    detailLabel: string;
    detailHref: 'contact' | 'detail';
  }
> = {
  Available: {
    indexLabel: 'View Details',
    detailLabel: 'Contact to Purchase',
    detailHref: 'contact',
  },
  'Coming Soon': {
    indexLabel: 'Notify Me',
    detailLabel: 'Notify Me',
    detailHref: 'contact',
  },
  'Sold Out': {
    indexLabel: 'Join Waitlist',
    detailLabel: 'Join Waitlist',
    detailHref: 'contact',
  },
};

export default function StatusCTA({
  status,
  productSlug,
  variant = 'detail',
  contactHref = '/contact',
}: StatusCTAProps) {
  const config = CTA_CONFIG[status];
  const label = variant === 'index' ? config.indexLabel : config.detailLabel;

  const href = variant === 'index' && status === 'Available' ? `/merch/${productSlug}` : contactHref;

  const isPrimary = status === 'Available';

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-colors ${
        isPrimary
          ? 'bg-shell-accent text-white hover:bg-shell-accent/90'
          : 'border border-shell-border bg-white text-shell-text hover:bg-shell-bg'
      }`}
    >
      {label}
    </Link>
  );
}

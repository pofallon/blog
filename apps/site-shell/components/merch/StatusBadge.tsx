import type { ProductStatus } from '@/lib/merch/types';

interface StatusBadgeProps {
  status: ProductStatus;
  size?: 'sm' | 'md';
  showHelperText?: boolean;
}

const STATUS_STYLES: Record<ProductStatus, { bg: string; text: string; border: string }> = {
  Available: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  'Coming Soon': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  'Sold Out': {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
};

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

const HELPER_TEXT: Record<ProductStatus, string> = {
  Available: 'Ready to ship',
  'Coming Soon': 'Sign up to be notified',
  'Sold Out': 'Join the waitlist',
};

export default function StatusBadge({ status, size = 'sm', showHelperText = false }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status];
  const helperText = HELPER_TEXT[status];

  return (
    <span
      role="status"
      aria-label={`Product status: ${status}${showHelperText ? ` - ${helperText}` : ''}`}
      title={showHelperText ? helperText : undefined}
      className={`inline-flex items-center rounded-full border font-medium ${styles.bg} ${styles.text} ${styles.border} ${SIZE_CLASSES[size]}`}
    >
      {status}
    </span>
  );
}

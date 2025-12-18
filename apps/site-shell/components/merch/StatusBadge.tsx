import { Badge } from '@/components/ui/badge';
import type { ProductStatus } from '@/lib/merch/types';

interface StatusBadgeProps {
  status: ProductStatus;
  size?: 'sm' | 'md';
  showHelperText?: boolean;
}

const STATUS_VARIANT: Record<ProductStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Available: 'default',
  'Coming Soon': 'secondary',
  'Sold Out': 'outline',
};

const HELPER_TEXT: Record<ProductStatus, string> = {
  Available: 'Ready to ship',
  'Coming Soon': 'Sign up to be notified',
  'Sold Out': 'Join the waitlist',
};

export default function StatusBadge({ status, size = 'sm', showHelperText = false }: StatusBadgeProps) {
  const variant = STATUS_VARIANT[status];
  const helperText = HELPER_TEXT[status];

  return (
    <Badge
      variant={variant}
      className={size === 'md' ? 'px-3 py-1' : ''}
      aria-label={`Product status: ${status}${showHelperText ? ` - ${helperText}` : ''}`}
      title={showHelperText ? helperText : undefined}
    >
      {status}
    </Badge>
  );
}

import Link from 'next/link';

interface MerchEmptyStateProps {
  contactHref?: string;
}

export default function MerchEmptyState({ contactHref = '/contact' }: MerchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-shell-border bg-white px-6 py-16 text-center">
      <div className="mb-4 text-5xl" role="img" aria-label="Gift emoji">
        🎁
      </div>
      <h2 className="text-2xl font-bold text-shell-text">Coming Soon</h2>
      <p className="mx-auto mt-3 max-w-md text-shell-muted">
        We&apos;re working on something special. Check back soon or sign up to be notified when
        products are available.
      </p>
      <Link
        href={contactHref}
        className="mt-6 inline-flex items-center rounded-lg bg-shell-accent px-6 py-2.5 font-medium text-white transition-colors hover:bg-shell-accent/90"
      >
        Get Notified
      </Link>
    </div>
  );
}

import Link from 'next/link';

interface CommerceInfoBlockProps {
  variant: 'index' | 'detail';
  contactHref?: string;
}

export default function CommerceInfoBlock({
  variant,
  contactHref = '/contact',
}: CommerceInfoBlockProps) {
  const HeadingTag = variant === 'index' ? 'h2' : 'h3';

  return (
    <section className="rounded-2xl border border-shell-border bg-gradient-to-br from-shell-bg to-white p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl" role="img" aria-label="Shopping cart">
          🛒
        </span>
        <div className="flex-1">
          <HeadingTag className="text-lg font-semibold text-shell-text">How to Purchase</HeadingTag>
          <p className="mt-2 text-shell-muted">
            We&apos;re setting up our online store. In the meantime, contact us directly to place an
            order or ask questions.
          </p>
          <Link
            href={contactHref}
            className="mt-4 inline-flex items-center rounded-lg bg-shell-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-shell-accent/90"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

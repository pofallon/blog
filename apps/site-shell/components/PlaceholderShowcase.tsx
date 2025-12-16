import type { PlaceholderPage } from '@/lib/types';
import Link from 'next/link';
import type { Route } from 'next';

type PlaceholderShowcaseProps = {
  placeholder: PlaceholderPage;
};

const isInternal = (href: string) => href.startsWith('/');
const asRoute = (href: string) => href as Route;

export default function PlaceholderShowcase({ placeholder }: PlaceholderShowcaseProps) {
  return (
    <section className="shell-surface space-y-8 rounded-3xl border px-6 py-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-shell-muted">
          {placeholder.slug} placeholder
        </p>
        <h1 className="text-3xl font-semibold text-shell-ink">{placeholder.title}</h1>
        <p className="text-lg text-shell-muted">{placeholder.description}</p>
        {placeholder.cta &&
          (isInternal(placeholder.cta.href) ? (
            <Link
              href={asRoute(placeholder.cta.href)}
              className="inline-flex items-center gap-2 rounded-full bg-shell-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-shell-accent"
            >
              {placeholder.cta.label}
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <a
              href={placeholder.cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-shell-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-shell-accent"
              target="_blank"
              rel="noreferrer"
            >
              {placeholder.cta.label}
              <span aria-hidden>↗</span>
            </a>
          ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {placeholder.layoutSlots.map((slot) => (
          <div key={slot.id} className="rounded-2xl border border-shell-border bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-shell-muted">
              {slot.id}
            </p>
            <p className="mt-1 text-sm text-shell-ink">{slot.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

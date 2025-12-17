import Link from 'next/link';
import { getNavigationLinks } from '@/lib/navigation';

export default function NotFound() {
  const navigation = getNavigationLinks();

  return (
    <div className="space-y-6 rounded-3xl border border-shell-border bg-white px-6 py-8 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-shell-muted">Route missing</p>
      <h1 className="text-3xl font-semibold text-shell-ink">This placeholder is not ready yet</h1>
      <p className="mx-auto max-w-2xl text-shell-muted">
        The requested page has not been wired into the shell. Choose one of the validated routes
        below to continue previewing the migration experience.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {navigation.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="rounded-full border border-shell-border px-4 py-2 text-sm font-medium text-shell-ink transition hover:border-shell-accent hover:text-shell-accent"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-shell-accent"
      >
        Return home <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

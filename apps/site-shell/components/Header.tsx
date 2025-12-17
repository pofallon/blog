import Link from 'next/link';
import Navigation from '@/components/Navigation';
import type { NavigationLink } from '@/lib/types';

type HeaderProps = {
  brandName: string;
  links: NavigationLink[];
  tagline?: string;
};

export default function Header({
  brandName,
  links,
  tagline = 'Consistent shell for home, blog, projects, and merch.',
}: HeaderProps) {
  return (
    <header
      role="banner"
      className="shell-surface flex flex-col gap-4 rounded-3xl border border-shell-border bg-white/80 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between"
    >
      <div>
        <Link href="/" className="text-lg font-semibold text-shell-ink hover:text-shell-accent">
          {brandName}
        </Link>
        <p className="text-sm text-shell-muted">{tagline}</p>
      </div>
      <Navigation ariaLabel="Primary" links={links} variant="header" />
    </header>
  );
}

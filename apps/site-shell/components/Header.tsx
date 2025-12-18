import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ModeToggle } from '@/components/mode-toggle';
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
      className="relative flex flex-col gap-4 rounded-3xl border-[1.5px] border-border bg-card px-6 py-5 md:flex-row md:items-center md:justify-between overflow-hidden"
      style={{ 
        boxShadow: `
          var(--g2k-shadow-lifted),
          var(--g2k-shadow-inset),
          inset 0 1px 0 hsl(var(--g2k-brass) / 0.08)
        `.replace(/\s+/g, ' ').trim()
      }}
    >
      {/* Subtle top edge highlight for industrial feel */}
      <div 
        className="absolute inset-x-0 top-0 h-px opacity-60" 
        style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--g2k-brass-shine) / 0.3) 20%, hsl(var(--g2k-brass-shine) / 0.5) 50%, hsl(var(--g2k-brass-shine) / 0.3) 80%, transparent)' }}
        aria-hidden="true"
      />
      
      <div>
        <Link href="/" className="font-brand text-4xl text-foreground hover:text-primary transition-colors">
          {brandName}
        </Link>
        <p className="text-sm text-muted-foreground">{tagline}</p>
      </div>
      <div className="flex items-center gap-4">
        <Navigation ariaLabel="Primary" links={links} variant="header" />
        <ModeToggle />
      </div>
    </header>
  );
}

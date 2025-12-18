import { HeroSection } from '@/components/HeroSection';
import { getNavigationLinks } from '@/lib/navigation';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function Home() {
  const navigation = getNavigationLinks();

  return (
    <div className="space-y-8">
      <HeroSection />
      <section 
        className="rounded-3xl border-[1.5px] border-shell-border bg-g2k-bg-raised/50 px-6 py-8"
        style={{ boxShadow: 'var(--g2k-shadow-sm), var(--g2k-shadow-inset)' }}
        aria-labelledby="explore-heading"
      >
        {/* Section header */}
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-4 h-4 text-g2k-brass" aria-hidden="true" />
          <h2 id="explore-heading" className="text-sm font-medium tracking-wide text-g2k-fg-secondary">
            Where to next?
          </h2>
        </div>
        
        {/* Destination cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {navigation.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="group block rounded-2xl border-[1.5px] border-shell-border bg-white dark:bg-g2k-bg-raised p-5 transition-[transform,border-color,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:border-g2k-brass/40 shadow-[var(--g2k-shadow-sm),var(--g2k-shadow-inset)] hover:shadow-[var(--g2k-shadow-md),var(--g2k-shadow-inset)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-shell-ink group-hover:text-g2k-brass transition-colors duration-150">
                    {link.label}
                  </p>
                  <p className="mt-1 text-sm text-shell-muted leading-relaxed">
                    {link.description}
                  </p>
                </div>
                {/* Subtle directional hint */}
                <span 
                  className="mt-0.5 text-g2k-fg-muted/40 group-hover:text-g2k-brass/60 transition-colors duration-150" 
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Subtle footer hint */}
        <p className="mt-6 text-xs text-g2k-fg-muted/60 text-center italic">
          Pick a door. See what&apos;s behind it.
        </p>
      </section>
    </div>
  );
}

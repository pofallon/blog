import { HeroSection } from '@/components/HeroSection';
import { getNavigationLinks } from '@/lib/navigation';

export default function Home() {
  const navigation = getNavigationLinks();

  return (
    <div className="space-y-8">
      <HeroSection />
      <section 
        className="rounded-3xl border-[1.5px] border-dashed border-shell-border px-6 py-6"
        style={{ boxShadow: 'var(--g2k-shadow-inset)' }}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-shell-muted">Navigation preview</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {navigation.map((link) => (
            <div 
              key={link.path} 
              className="rounded-2xl border-[1.5px] border-shell-border bg-white dark:bg-g2k-bg-raised p-4 transition-all hover:border-g2k-brass/30"
              style={{ boxShadow: 'var(--g2k-shadow-sm), var(--g2k-shadow-inset)' }}
            >
              <p className="text-sm font-semibold text-shell-ink">{link.label}</p>
              <p className="text-sm text-shell-muted">{link.description}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-shell-muted/70">
                Route: {link.path}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import PlaceholderShowcase from '@/components/PlaceholderShowcase';
import { getNavigationLinks } from '@/lib/navigation';
import { getPlaceholderBySlug } from '@/lib/placeholders';

export default function Home() {
  const placeholder = getPlaceholderBySlug('home');
  const navigation = getNavigationLinks();

  return (
    <div className="space-y-8">
      <PlaceholderShowcase placeholder={placeholder} />
      <section className="rounded-3xl border border-dashed border-shell-border px-6 py-6">
        <p className="text-xs uppercase tracking-[0.2em] text-shell-muted">Navigation preview</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {navigation.map((link) => (
            <div key={link.path} className="rounded-2xl border border-shell-border bg-white p-4">
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
